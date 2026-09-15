import { useCallback, useEffect, useRef, useState } from 'react';
import { api, dispositivoId, ErroDaApi } from '../lib/api';
import { navegar } from '../lib/rota';
import type { EstadoSessao, Etapa, VersaoAula } from '@clareira/domain';

/**
 * CENA 8 — ESTÚDIO DE TREINO.
 *
 * Regras desta tela, todas verificáveis olhando o código:
 *  · O MOTOR é a autoridade. A interface envia comandos e desenha o estado que
 *    voltou do servidor. Nenhuma animação concede progresso.
 *  · Durante o esforço, corpo e instrução ficam ESTÁVEIS. Nenhuma promoção,
 *    nenhum upsell, nenhum alerta empilhado.
 *  · Pausar responde imediatamente, por botão, sem depender de voz nem câmera.
 *  · Buffering vira comando, para o cronômetro do servidor não avançar como se
 *    a instrução tivesse sido reproduzida.
 */

interface Resposta {
  sessao: EstadoSessao;
  aula: VersaoAula;
  resumo: any;
}

export function Estudio({ sessaoId }: { sessaoId: string }) {
  const [dados, setDados] = useState<Resposta | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [explicando, setExplicando] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contador = useRef(0);

  /** Envia um comando e adota o estado devolvido pelo servidor. */
  const comandar = useCallback(
    async (tipo: string, carga?: Record<string, unknown>) => {
      const id = `${sessaoId}-${tipo}-${++contador.current}-${Date.now()}`;
      try {
        const r = await api<Resposta>(`/v1/sessoes/${sessaoId}/comandos`, {
          metodo: 'POST',
          corpo: { id, tipo, dispositivoId: dispositivoId(), carga },
        });
        setDados(r);
        setErro(null);
        return r;
      } catch (e) {
        if (e instanceof ErroDaApi && e.status === 409) {
          // Conflito de versão: adota o estado do servidor em vez de insistir.
          const atual = e.detalhe?.sessao as EstadoSessao | undefined;
          if (atual) setDados(d => (d ? { ...d, sessao: atual } : d));
          setErro('Outro aparelho mudou esta sessão. Atualizamos a tela com o estado mais recente.');
        } else {
          setErro((e as Error).message);
        }
        return null;
      }
    },
    [sessaoId],
  );

  useEffect(() => {
    api<Resposta>(`/v1/sessoes/${sessaoId}`)
      .then(setDados)
      .catch(e => setErro(e.message));
  }, [sessaoId]);

  // Ao voltar para a aba, reconcilia com o servidor: o estado verdadeiro é o
  // dele, e uma ação obsoleta não pode reiniciar o treino.
  useEffect(() => {
    const aoVoltar = () => {
      if (document.hidden) return;
      api<Resposta & { servidorMaisNovo: boolean }>(
        `/v1/sessoes/${sessaoId}/estado?versaoLocal=${dados?.sessao.versao ?? 0}`,
      )
        .then(r => { if (r.servidorMaisNovo) setDados(r); })
        .catch(() => {});
    };
    document.addEventListener('visibilitychange', aoVoltar);
    return () => document.removeEventListener('visibilitychange', aoVoltar);
  }, [sessaoId, dados?.sessao.versao]);

  // Atalhos de teclado. Espaço pausa e retoma — a ação mais urgente é a mais
  // fácil de alcançar.
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        pausarOuRetomar();
      }
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  });

  if (erro && !dados) return <section className="secao"><p className="erro" role="alert">{erro}</p></section>;
  if (!dados) return <section className="secao"><p className="apoio">Abrindo a aula…</p></section>;

  const { sessao, aula } = dados;
  const etapa: Etapa | undefined = aula.etapas[sessao.etapaIndice];
  const proxima: Etapa | undefined = aula.etapas[sessao.etapaIndice + 1];
  const pausado = sessao.estado === 'pausado';
  const finalizada = sessao.estado === 'concluido' || sessao.estado === 'encerrado_parcial';
  const aguardando = sessao.estado === 'aguardando_retorno' || sessao.estado === 'ausencia_possivel';
  const creditaveis = aula.etapas.filter(e => e.creditavel);
  const progresso = creditaveis.length ? sessao.etapasCreditadas.length / creditaveis.length : 0;

  function pausarOuRetomar() {
    if (finalizada) return;
    if (pausado || aguardando) {
      comandar('retomar');
      videoRef.current?.pause();
    } else {
      comandar('pausar');
      videoRef.current?.pause();
    }
  }

  async function reproduzir() {
    await comandar('reproduzir');
    videoRef.current?.play().catch(() => {
      setErro('O navegador bloqueou a reprodução. Toque no vídeo para liberar o som e a imagem.');
    });
  }

  async function encerrar(completa: boolean) {
    videoRef.current?.pause();
    const r = await comandar(completa ? 'concluir' : 'encerrar_parcial');
    if (r) navegar(`/sessao/${sessaoId}/fim`);
  }

  if (finalizada) {
    navegar(`/sessao/${sessaoId}/fim`, { substituir: true });
    return null;
  }

  return (
    <div className="estudio" data-ambiente="estudio">
      <header className="estudio-topo">
        <div>
          <p className="etiqueta" style={{ margin: 0, color: 'var(--tinta-70)' }}>
            {rotuloDoEstado(sessao.estado)}
          </p>
          <div className="faixa-etapa">
            <span className="agora">{etapa?.rotulo ?? 'Preparando'}</span>
            {proxima && <span className="proximo">a seguir: {proxima.rotulo}</span>}
          </div>
        </div>
        <button type="button" className="botao botao-secundario" onClick={() => encerrar(false)}>
          Encerrar
        </button>
      </header>

      <div className="estudio-palco">
        <div className="estudio-video">
          <video
            ref={videoRef}
            poster="/media/sala-16x9.jpg"
            playsInline
            controls={false}
            preload="metadata"
            aria-label={`Vídeo da aula. Etapa atual: ${etapa?.rotulo ?? 'preparação'}.`}
            onWaiting={() => comandar('buffering_inicio')}
            onPlaying={() => comandar('buffering_fim')}
            onError={() => comandar('erro_midia', { mensagem: 'falha ao carregar a mídia' })}
            onTimeUpdate={e => {
              const pos = Math.round((e.target as HTMLVideoElement).currentTime * 1000);
              // Só reporta a cada ~2 s: um comando por quadro seria desperdício.
              if (pos - (sessao.relogios.posicaoMidiaMs ?? 0) >= 2000) {
                comandar('progresso_midia', { posicaoMs: pos, toleranciaMs: 3000 });
              }
            }}
          >
            <source src="/media/sala-16x9.webm" type="video/webm" />
            <source src="/media/sala-16x9.mp4" type="video/mp4" />
          </video>

          {/* Estado da mídia dito com honestidade, sem esconder falha. */}
          {sessao.midia === 'buffering' && (
            <p style={sobreposicao} role="status">Carregando o vídeo… o cronômetro está parado.</p>
          )}
          {sessao.midia === 'erro' && (
            <p style={sobreposicao} role="alert">
              O vídeo falhou. Sua sessão continua salva — você pode tentar de novo ou encerrar sem perder o registro.
            </p>
          )}
          {aguardando && (
            <div style={{ ...sobreposicao, display: 'grid', gap: 12, placeItems: 'center' }} role="status">
              <p style={{ margin: 0 }}>Pausamos por aqui. Quando quiser, é você quem recomeça.</p>
              <button type="button" className="botao botao-primario" onClick={() => comandar('retomar')}>
                Voltar para a aula
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="estudio-rodape">
        <div style={{ flex: '1 1 260px' }}>
          <div className="progresso" role="img" aria-label={`${sessao.etapasCreditadas.length} de ${creditaveis.length} séries registradas`}>
            <i style={{ width: `${progresso * 100}%` }} />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--tinta-70)' }}>
            {sessao.etapasCreditadas.length} de {creditaveis.length} {creditaveis.length === 1 ? 'série registrada' : 'séries registradas'}
          </p>
        </div>

        {/* Controles essenciais. Nenhum depende de hover, voz ou câmera. */}
        {/* A decisão olha o estado de DOMÍNIO, não o da mídia: durante a pausa
            o motor recusa "reproduzir" e exige "retomar". Confundir os dois
            fazia o botão "Continuar" devolver conflito. */}
        <button
          type="button"
          className="botao botao-primario"
          onClick={pausado || aguardando ? pausarOuRetomar : sessao.midia === 'reproduzindo' ? pausarOuRetomar : reproduzir}
        >
          {pausado || aguardando ? 'Continuar' : sessao.midia === 'reproduzindo' ? 'Pausar' : 'Reproduzir'}
        </button>

        <button type="button" className="botao botao-secundario" onClick={() => setExplicando(v => !v)} aria-expanded={explicando}>
          Não entendi o movimento
        </button>

        {etapa?.alternativas?.length ? (
          <button
            type="button"
            className="botao botao-secundario"
            onClick={() => comandar('trocar_alternativa', { etapaId: etapa.alternativas![0] })}
          >
            Quero uma opção mais fácil
          </button>
        ) : null}

        <button type="button" className="botao botao-secundario" onClick={() => comandar('iniciar_descanso')}>
          Descansar mais
        </button>

        {sessao.etapaIndice < aula.etapas.length - 1 && (
          <button type="button" className="botao botao-secundario" onClick={() => comandar('avancar_etapa')}>
            Próxima etapa
          </button>
        )}

        <button type="button" className="botao botao-primario" onClick={() => encerrar(true)}>
          Concluir
        </button>
      </div>

      {explicando && etapa && (
        <div className="secao" style={{ paddingTop: 0 }}>
          <div className="aviso" style={{ background: 'rgba(246,242,234,.06)', borderColor: 'var(--linha-clara)' }}>
            <div>
              <p style={{ margin: '0 0 var(--e-2)' }}>
                <strong>{etapa.rotulo}</strong>
              </p>
              <p style={{ margin: 0, fontSize: 'var(--t-apoio)' }}>
                Rever a explicação recalcula o contexto da etapa: o que você já
                registrou continua registrado, e rever não conta como repetir.
              </p>
              <div className="acoes">
                <button type="button" className="botao botao-secundario" onClick={() => comandar('rever_explicacao')}>
                  Rever a explicação do professor
                </button>
              </div>
              {/* Estado real: não há assistente conectado. */}
              <p style={{ margin: 'var(--e-3) 0 0', fontSize: 12, color: 'var(--tinta-70)' }}>
                A assistência por conversa ainda não está conectada neste ambiente.
                As explicações vêm do conteúdo gravado pelo professor.
              </p>
            </div>
          </div>
        </div>
      )}

      {erro && <p className="erro" role="alert" style={{ margin: '0 var(--gutter) var(--e-5)' }}>{erro}</p>}
    </div>
  );
}

const sobreposicao: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  margin: 0,
  padding: 24,
  textAlign: 'center',
  background: 'rgba(20,18,15,.78)',
  color: '#f6f2ea',
  fontSize: 15,
};

function rotuloDoEstado(estado: EstadoSessao['estado']): string {
  return {
    preparando: 'Preparação',
    demonstrando: 'Demonstração',
    exercitando: 'Em exercício',
    descansando: 'Descanso',
    pausado: 'Pausado',
    ausencia_possivel: 'Pausamos — você ainda está aí?',
    aguardando_retorno: 'Esperando você',
    concluido: 'Concluída',
    encerrado_parcial: 'Encerrada',
  }[estado];
}
