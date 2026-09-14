import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ErroDaApi, minutos } from '../lib/api';
import { Link, casar } from '../lib/rota';
import type { Etapa } from '@clareira/domain';

/**
 * STUDIO DO PROFESSOR.
 *
 * Uma operação real de autoria, não uma tabela de vídeos com contadores:
 * preview central, linha do tempo editorial, propriedades contextuais, autosave
 * com estado comunicado, e publicação como transição controlada que diz
 * exatamente o que falta.
 */
export function Studio({ caminho }: { caminho: string }) {
  const params = casar('/studio/aula/:id', caminho);
  return params ? <Editor aulaId={params.id} /> : <Lista />;
}

function Lista() {
  const [aulas, setAulas] = useState<any[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api<{ aulas: any[] }>('/v1/studio/aulas').then(r => setAulas(r.aulas)).catch(e => setErro(e.message));
  }, []);

  if (erro) return <section className="secao"><p className="erro" role="alert">{erro}</p></section>;

  return (
    <section className="secao" aria-labelledby="titulo-studio">
      <p className="etiqueta">Studio</p>
      <h1 className="titulo-m" id="titulo-studio">Suas aulas</h1>

      {aulas === null && <p className="apoio">Carregando…</p>}

      {aulas && (
        <div className="grade" style={{ marginTop: 'var(--e-5)' }}>
          {aulas.map(a => (
            <Link key={a.id} className="cartao" para={`/studio/aula/${a.id}`}>
              <div className="cartao-midia">{a.posterUrl && <img src={a.posterUrl} alt="" loading="lazy" />}</div>
              <div className="cartao-corpo">
                <h3>{a.titulo}</h3>
                <ul className="ficha">
                  <li>{rotuloEstado(a.estado)}</li>
                  {a.versaoPublicada && <li>v{a.versaoPublicada}</li>}
                  <li>{minutos(a.duracaoMs)} min</li>
                </ul>
                {/* Enviado ≠ transcodificando ≠ pronto ≠ publicado. */}
                <p style={{ fontSize: 12 }}>
                  Mídia: <strong>{a.midiaProcessamento}</strong>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <hr className="fio" />
      <Biblioteca />
    </section>
  );
}

function Biblioteca() {
  const [dados, setDados] = useState<any>(null);
  useEffect(() => {
    api('/v1/studio/midias').then(setDados).catch(() => {});
  }, []);
  if (!dados) return null;

  return (
    <div>
      <h2 className="titulo-p">Biblioteca de mídia</h2>
      {/* Estado real do pipeline de upload, com as pendências nomeadas. */}
      {!dados.upload.habilitado && (
        <div className="aviso">
          <div>
            <p style={{ margin: '0 0 var(--e-2)' }}><strong>Envio de vídeo ainda não está ligado.</strong> {dados.upload.motivo}</p>
            <ul style={{ margin: 0, paddingLeft: '1.1em', fontSize: 'var(--t-apoio)' }}>
              {dados.upload.pendencias.map((p: string) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>
      )}
      <div className="grade">
        {dados.midias.map((m: any) => (
          <div key={m.id} className="cartao">
            <div className="cartao-midia"><img src={m.posterUrl} alt="" loading="lazy" /></div>
            <div className="cartao-corpo">
              <h3 style={{ fontSize: 14 }}>{m.id}</h3>
              <p style={{ fontSize: 12 }}>
                {m.largura}×{m.altura} · {Math.round(m.duracaoMs / 1000)}s · {m.processamento}
              </p>
              {/* Procedência sempre visível para quem monta a aula. */}
              <p style={{ fontSize: 11, color: 'var(--tinta-70)' }}>
                {m.origem}
                <br />
                {m.licenca}
                {m.ilustrativo && <><br /><strong>Ilustrativo — não use como aula autoral.</strong></>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor({ aulaId }: { aulaId: string }) {
  const [dados, setDados] = useState<any>(null);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [salvamento, setSalvamento] = useState<'salvo' | 'salvando' | 'pendente' | 'erro'>('salvo');
  const [problemas, setProblemas] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const temporizador = useRef<number | null>(null);

  const recarregar = useCallback(() => {
    api(`/v1/studio/aulas/${aulaId}`).then(d => {
      setDados(d);
      setEtapas(d.etapas);
      setProblemas([]);
    });
  }, [aulaId]);

  useEffect(recarregar, [recarregar]);

  /** Autosave com estado comunicado — o professor sabe se salvou. */
  const salvar = useCallback(
    (proximas: Etapa[]) => {
      setEtapas(proximas);
      setSalvamento('pendente');
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(async () => {
        setSalvamento('salvando');
        try {
          const r = await api<{ problemas: string[] }>(`/v1/studio/aulas/${aulaId}/etapas`, {
            metodo: 'PATCH',
            corpo: { etapas: proximas },
          });
          setProblemas(r.problemas);
          setSalvamento('salvo');
        } catch {
          setSalvamento('erro');
        }
      }, 700);
    },
    [aulaId],
  );

  if (!dados) return <section className="secao"><p className="apoio">Abrindo o editor…</p></section>;

  const { aula, midia, bloqueios, versoes } = dados;
  const duracao = aula.duracaoMs;
  const atual = etapas.find(e => e.id === selecionada);

  async function transicionar(estado: string) {
    setMensagem(null);
    try {
      await api(`/v1/studio/aulas/${aulaId}/estado`, { metodo: 'POST', corpo: { estado } });
      recarregar();
    } catch (e) {
      setMensagem((e as Error).message);
    }
  }

  async function publicar() {
    setMensagem(null);
    try {
      const r = await api<any>(`/v1/studio/aulas/${aulaId}/publicar`, { metodo: 'POST', corpo: {} });
      setMensagem(
        `Publicada a versão ${r.versao}.` +
          (r.observacao ? ` ${r.observacao}` : ''),
      );
      recarregar();
    } catch (e) {
      if (e instanceof ErroDaApi && e.detalhe?.bloqueios) {
        setMensagem(`${e.message} ${e.detalhe.bloqueios.map((b: any) => b.mensagem).join(' ')}`);
      } else {
        setMensagem((e as Error).message);
      }
    }
  }

  return (
    <section className="secao" aria-labelledby="titulo-editor">
      <div className="linha-entre">
        <div>
          <p className="etiqueta">Editando · {rotuloEstado(aula.estado)}</p>
          <h1 className="titulo-m" id="titulo-editor" style={{ marginBottom: 0 }}>{aula.titulo}</h1>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--tinta-70)' }} role="status" aria-live="polite">
          {{ salvo: 'Tudo salvo', salvando: 'Salvando…', pendente: 'Alterações não salvas', erro: 'Falha ao salvar' }[salvamento]}
        </p>
      </div>

      <div style={{ display: 'grid', gap: 'var(--e-6)', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)', marginTop: 'var(--e-5)' }}>
        <div>
          {/* Preview central real: é o vídeo da aula, não um placeholder. */}
          <div style={{ borderRadius: 'var(--raio-m)', overflow: 'hidden', background: '#000', aspectRatio: '16 / 9' }}>
            {midia ? (
              <video ref={videoRef} poster={midia.posterUrl} controls playsInline preload="metadata" style={{ width: '100%', height: '100%' }}>
                <source src={midia.webmUrl} type="video/webm" />
                <source src={midia.mp4Url} type="video/mp4" />
              </video>
            ) : (
              <div className="vazio" style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#fff' }}>
                Nenhuma mídia associada
              </div>
            )}
          </div>

          <h2 className="titulo-p" style={{ marginTop: 'var(--e-5)' }}>Linha do tempo</h2>
          <Timeline
            etapas={etapas}
            duracao={duracao}
            selecionada={selecionada}
            aoSelecionar={id => {
              setSelecionada(id);
              const e = etapas.find(x => x.id === id);
              if (e && videoRef.current) videoRef.current.currentTime = e.inicioMs / 1000;
            }}
          />

          <div className="acoes">
            <button
              type="button"
              className="botao botao-secundario"
              onClick={() => {
                const inicio = Math.round((videoRef.current?.currentTime ?? 0) * 1000);
                const nova: Etapa = {
                  id: `e${Date.now().toString(36)}`,
                  tipo: 'serie',
                  rotulo: 'Nova série',
                  inicioMs: inicio,
                  fimMs: Math.min(duracao, inicio + 60_000),
                  creditavel: true,
                };
                salvar([...etapas, nova].sort((a, b) => a.inicioMs - b.inicioMs));
                setSelecionada(nova.id);
              }}
            >
              Marcar etapa na posição atual
            </button>
          </div>

          {problemas.length > 0 && (
            <div className="erro" role="status">
              <strong>Problemas no rascunho:</strong>
              <ul style={{ margin: 'var(--e-2) 0 0', paddingLeft: '1.1em' }}>
                {problemas.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          )}
        </div>

        <aside>
          <h2 className="titulo-p">Propriedades</h2>
          {atual ? (
            <PropriedadesDaEtapa
              etapa={atual}
              duracao={duracao}
              todas={etapas}
              aoMudar={proxima => salvar(etapas.map(e => (e.id === proxima.id ? proxima : e)))}
              aoRemover={() => {
                salvar(etapas.filter(e => e.id !== atual.id));
                setSelecionada(null);
              }}
            />
          ) : (
            <p className="apoio" style={{ fontSize: 'var(--t-apoio)' }}>
              Selecione uma etapa na linha do tempo para editar.
            </p>
          )}

          <hr className="fio" style={{ margin: 'var(--e-5) 0' }} />

          <h2 className="titulo-p">Publicação</h2>

          {/* O bloqueio é ESPECÍFICO e o editor continua editando. */}
          {bloqueios.length > 0 ? (
            <div className="aviso">
              <div>
                <p style={{ margin: '0 0 var(--e-2)' }}><strong>Ainda não dá para publicar:</strong></p>
                <ul style={{ margin: 0, paddingLeft: '1.1em', fontSize: 'var(--t-apoio)' }}>
                  {bloqueios.map((b: any) => <li key={b.codigo}>{b.mensagem}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <p className="apoio" style={{ fontSize: 'var(--t-apoio)' }}>Tudo pronto para publicar.</p>
          )}

          <div className="acoes" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            {aula.estado === 'rascunho' && (
              <button type="button" className="botao botao-secundario" onClick={() => transicionar('em_revisao')}>
                Enviar para revisão
              </button>
            )}
            {aula.estado === 'em_revisao' && (
              <button type="button" className="botao botao-secundario" onClick={() => transicionar('aprovada')}>
                Aprovar
              </button>
            )}
            {(aula.estado === 'publicada' || aula.estado === 'aprovada') && (
              <button type="button" className="botao botao-secundario" onClick={() => transicionar('rascunho')}>
                Voltar para rascunho
              </button>
            )}
            <button type="button" className="botao botao-primario" onClick={publicar} disabled={bloqueios.length > 0}>
              Publicar nova versão
            </button>
          </div>

          {mensagem && <p className="aviso" role="status" style={{ display: 'block' }}>{mensagem}</p>}

          {versoes?.length > 0 && (
            <>
              <h3 style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tinta-70)', marginTop: 'var(--e-5)' }}>
                Versões publicadas
              </h3>
              <ul style={{ margin: 'var(--e-2) 0 0', paddingLeft: '1.1em', fontSize: 12 }}>
                {versoes.map((v: any) => (
                  <li key={v.versao}>
                    v{v.versao} — {new Date(v.publicada_em_ms).toLocaleString('pt-BR')}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 12, color: 'var(--tinta-70)', marginTop: 'var(--e-2)' }}>
                Sessões em andamento continuam na versão em que começaram.
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

function Timeline({
  etapas, duracao, selecionada, aoSelecionar,
}: { etapas: Etapa[]; duracao: number; selecionada: string | null; aoSelecionar: (id: string) => void }) {
  const cores: Record<string, string> = {
    preparacao: 'var(--areia)',
    demonstracao: 'color-mix(in srgb, var(--luz) 55%, var(--papel))',
    serie: 'var(--argila)',
    descanso: 'color-mix(in srgb, var(--oliva) 45%, var(--papel))',
    alternativa: 'color-mix(in srgb, var(--argila) 35%, var(--papel))',
    encerramento: 'var(--areia)',
    explicacao: 'var(--areia)',
    lembrete: 'var(--areia)',
  };

  if (etapas.length === 0) {
    return <div className="vazio">A linha do tempo está vazia. Marque a primeira etapa.</div>;
  }

  return (
    // Lista com equivalente por teclado: navegar e selecionar sem mouse.
    <ul
      style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}
      aria-label="Etapas da aula"
    >
      {etapas.map(e => {
        const largura = ((e.fimMs - e.inicioMs) / duracao) * 100;
        const offset = (e.inicioMs / duracao) * 100;
        const ativa = e.id === selecionada;
        return (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => aoSelecionar(e.id)}
              aria-pressed={ativa}
              style={{
                display: 'block', width: '100%', textAlign: 'left', border: 0, background: 'none',
                cursor: 'pointer', padding: 0, minHeight: 'auto',
              }}
            >
              <span style={{ display: 'flex', gap: 'var(--e-3)', alignItems: 'center', fontSize: 12 }}>
                <span style={{ minWidth: '14ch', color: 'var(--tinta-70)' }}>{e.rotulo}</span>
                <span style={{ position: 'relative', flex: 1, height: 26, background: 'var(--areia)', borderRadius: 3 }}>
                  <span
                    style={{
                      position: 'absolute', left: `${offset}%`, width: `${Math.max(largura, 1.5)}%`,
                      top: 0, bottom: 0, background: cores[e.tipo] ?? 'var(--areia)',
                      borderRadius: 3,
                      outline: ativa ? '2px solid var(--tinta)' : 'none',
                      outlineOffset: 1,
                    }}
                  />
                </span>
                <span style={{ minWidth: '7ch', color: 'var(--tinta-70)', textAlign: 'right' }}>
                  {formatarTempo(e.inicioMs)}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function PropriedadesDaEtapa({
  etapa, duracao, todas, aoMudar, aoRemover,
}: { etapa: Etapa; duracao: number; todas: Etapa[]; aoMudar: (e: Etapa) => void; aoRemover: () => void }) {
  return (
    <div>
      <div className="campo">
        <label htmlFor="rotulo">Nome da etapa</label>
        <input id="rotulo" value={etapa.rotulo} onChange={e => aoMudar({ ...etapa, rotulo: e.target.value })} />
      </div>

      <div className="campo">
        <label htmlFor="tipo">Tipo</label>
        <select id="tipo" value={etapa.tipo} onChange={e => aoMudar({ ...etapa, tipo: e.target.value as Etapa['tipo'] })}>
          {['preparacao', 'demonstracao', 'serie', 'descanso', 'explicacao', 'alternativa', 'lembrete', 'encerramento'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="inicio">Começa em (segundos)</label>
        <input
          id="inicio" type="number" min={0} max={duracao / 1000}
          value={Math.round(etapa.inicioMs / 1000)}
          onChange={e => aoMudar({ ...etapa, inicioMs: Number(e.target.value) * 1000 })}
        />
      </div>

      <div className="campo">
        <label htmlFor="fim">Termina em (segundos)</label>
        <input
          id="fim" type="number" min={0} max={duracao / 1000}
          value={Math.round(etapa.fimMs / 1000)}
          onChange={e => aoMudar({ ...etapa, fimMs: Number(e.target.value) * 1000 })}
        />
      </div>

      <div className="campo">
        <label>
          <input
            type="checkbox"
            checked={etapa.creditavel}
            onChange={e => aoMudar({ ...etapa, creditavel: e.target.checked })}
            style={{ minHeight: 'auto', marginRight: 8 }}
          />
          Conta como execução no histórico
        </label>
        <span className="dica">
          Preparação, demonstração e descanso normalmente não contam.
        </span>
      </div>

      {etapa.tipo === 'serie' && (
        <div className="campo">
          <label htmlFor="alt">Alternativa aprovada</label>
          <select
            id="alt"
            value={etapa.alternativas?.[0] ?? ''}
            onChange={e => aoMudar({ ...etapa, alternativas: e.target.value ? [e.target.value] : [] })}
          >
            <option value="">Nenhuma</option>
            {todas.filter(x => x.tipo === 'alternativa').map(x => (
              <option key={x.id} value={x.id}>{x.rotulo}</option>
            ))}
          </select>
          <span className="dica">
            Só alternativas aprovadas aparecem para o aluno durante a aula.
          </span>
        </div>
      )}

      <button type="button" className="botao-texto" onClick={aoRemover}>Remover esta etapa</button>
    </div>
  );
}

function formatarTempo(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function rotuloEstado(e: string): string {
  return { rascunho: 'Rascunho', em_revisao: 'Em revisão', aprovada: 'Aprovada', publicada: 'Publicada', arquivada: 'Arquivada' }[e] ?? e;
}
