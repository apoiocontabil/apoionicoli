import { useEffect, useState } from 'react';
import { api, minutos, textoDeEquipamento, textoDeEspaco, type AulaResumo } from '../lib/api';
import { Link, navegar } from '../lib/rota';
import type { Usuario } from '../App';

/**
 * CENA 6 — HOJE.
 *
 * Uma ação principal: começar ou continuar. A recomendação é ESTÁVEL — o
 * servidor persiste a escolha do dia e recarregar não troca o plano.
 */
export function Hoje({ usuario, carregando }: { usuario: Usuario | null; carregando: boolean }) {
  const [hoje, setHoje] = useState<{ dia: string; aula: AulaResumo | null; motivo: string; regraVersao: string } | null>(null);
  const [historico, setHistorico] = useState<any[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (carregando) return;
    if (!usuario) { navegar('/entrar'); return; }

    api('/v1/hoje').then(setHoje).catch(e => setErro(e.message));
    api<{ sessoes: any[] }>('/v1/historico').then(r => setHistorico(r.sessoes)).catch(() => setHistorico([]));
  }, [usuario, carregando]);

  if (carregando) return <section className="secao"><p className="apoio">Carregando…</p></section>;
  if (!usuario) return null;

  const emAberto = historico?.find(s => !s.finalizadaEmMs);

  return (
    <section className="secao" aria-labelledby="titulo-hoje">
      <p className="etiqueta">{formatarDia(hoje?.dia)}</p>
      <h1 className="titulo-m" id="titulo-hoje">Olá, {usuario.nome.split(' ')[0]}</h1>

      {erro && <p className="erro" role="alert">{erro}</p>}

      {/* Retomar vem antes de começar algo novo: voltar sem burocracia. */}
      {emAberto && (
        <div className="aviso">
          <div>
            <p style={{ margin: '0 0 var(--e-3)' }}>
              <strong>Você tem uma aula em andamento.</strong> Podemos continuar de onde parou.
            </p>
            <Link className="botao botao-primario" para={`/sessao/${emAberto.id}`}>Continuar “{emAberto.titulo}”</Link>
          </div>
        </div>
      )}

      {hoje?.aula ? (
        <article
          style={{
            display: 'grid',
            gap: 'var(--e-6)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            alignItems: 'center',
            marginTop: 'var(--e-6)',
          }}
        >
          <div style={{ borderRadius: 'var(--raio-m)', overflow: 'hidden', aspectRatio: '16 / 9', background: 'var(--areia)' }}>
            {hoje.aula.midia && <img src={hoje.aula.midia.posterUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>

          <div>
            <p className="etiqueta">Sua sessão de hoje</p>
            <h2 className="titulo-m">{hoje.aula.titulo}</h2>
            <p className="apoio">{hoje.aula.descricao}</p>

            {/* Por que esta aula: a recomendação se explica em uma frase. */}
            <p className="apoio" style={{ fontSize: 13, fontStyle: 'italic' }}>{hoje.motivo}</p>

            <ul className="ficha">
              <li>{minutos(hoje.aula.duracaoMs)} min</li>
              <li>{textoDeEquipamento(hoje.aula.equipamentos)}</li>
              <li>{textoDeEspaco(hoje.aula.espacoMinimo)}</li>
              <li>com {hoje.aula.professor.nome}</li>
            </ul>

            <div className="acoes">
              <Link className="botao botao-primario" para={`/aula/${hoje.aula.id}/preparar`}>Preparar e começar</Link>
              <button
                type="button"
                className="botao botao-secundario"
                onClick={() => api('/v1/hoje?regerar=1').then(setHoje)}
              >
                Quero outra opção
              </button>
            </div>
          </div>
        </article>
      ) : (
        !erro && <p className="apoio">Preparando sua sessão…</p>
      )}

      <hr className="fio" />

      <h2 className="titulo-p">Suas últimas sessões</h2>
      {historico === null && <p className="apoio">Carregando histórico…</p>}
      {historico?.length === 0 && (
        <div className="vazio">
          <p style={{ margin: 0 }}>
            Nada por aqui ainda. Quando você treinar, o registro aparece — inclusive
            se você parar no meio.
          </p>
        </div>
      )}
      {historico && historico.length > 0 && (
        <ul className="pilha" style={{ listStyle: 'none', padding: 0 }}>
          {historico.slice(0, 8).map(s => (
            <li key={s.id} className="linha-entre" style={{ paddingBottom: 'var(--e-3)', borderBottom: '1px solid var(--linha)' }}>
              <div>
                <strong style={{ fontWeight: 600 }}>{s.titulo}</strong>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--tinta-70)' }}>
                  {/* Sem culpa e sem celebração enganosa: o que foi, foi. */}
                  {s.motivoFinal === 'completa'
                    ? 'Concluída'
                    : s.motivoFinal === 'parcial'
                      ? 'Encerrada no meio — o que você fez está registrado'
                      : 'Em andamento'}
                  {s.tempoAtivoMs > 0 && ` · ${Math.round(s.tempoAtivoMs / 60000)} min de instrução`}
                </p>
              </div>
              <span style={{ fontSize: 12, color: 'var(--tinta-70)' }}>
                {new Date(s.iniciadaEmMs).toLocaleDateString('pt-BR')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatarDia(dia?: string): string {
  if (!dia) return '';
  const [a, m, d] = dia.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}
