import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link } from '../lib/rota';
import { Claro } from '../scenes/Claro';

/**
 * CENA 9 — CONCLUSÃO.
 *
 * O claro SE FECHA: o retângulo de luz volta a ser fresta e o ambiente volta ao
 * papel. É o fechamento do gesto que abriu a jornada — a casa volta a ser casa.
 *
 * O resumo sai do histórico real. Nada de número gerado para preencher a tela,
 * nada de celebração que não corresponda ao que foi registrado.
 */
export function Fim({ sessaoId }: { sessaoId: string }) {
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api(`/v1/sessoes/${sessaoId}`).then(setDados).catch(e => setErro(e.message));
  }, [sessaoId]);

  if (erro) return <section className="secao"><p className="erro" role="alert">{erro}</p></section>;
  if (!dados) return <section className="secao"><p className="apoio">Salvando sua sessão…</p></section>;

  const r = dados.resumo;
  const completa = r.completa;
  const minutosAtivos = Math.round(r.tempoAtivoMs / 60_000);

  return (
    <section className="secao" aria-labelledby="titulo-fim">
      <div
        style={{
          display: 'grid',
          gap: 'var(--e-7)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
          alignItems: 'center',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <div style={{ position: 'relative', aspectRatio: '4 / 3', minHeight: 240 }}>
          <Claro
            webmUrl="/media/sala-16x9.webm"
            mp4Url="/media/sala-16x9.mp4"
            posterUrl="/media/sala-16x9.jpg"
            descricao="A luz da sala se recolhe ao fim do treino."
            sentido="fechando"
            duracao={2.4}
            ilustrativo
          />
        </div>

        <div>
          <p className="etiqueta">{completa ? 'Sessão concluída' : 'Sessão encerrada'}</p>
          <h1 className="titulo-m" id="titulo-fim">
            {completa ? 'Você fechou o treino de hoje.' : 'Você fez uma parte — e isso ficou registrado.'}
          </h1>

          <p className="apoio">
            {completa
              ? 'A sala volta a ser sala. Amanhã a gente abre de novo.'
              : 'Parar no meio não apaga o que você fez. Da próxima vez você continua daqui.'}
          </p>

          {/* Resumo VERDADEIRO, derivado só do que foi registrado. */}
          <ul className="pilha" style={{ listStyle: 'none', padding: 0, margin: 'var(--e-5) 0' }}>
            <Linha rotulo="Séries registradas" valor={`${r.etapasCreditadas} de ${r.etapasCreditaveis}`} />
            <Linha rotulo="Instrução reproduzida" valor={minutosAtivos > 0 ? `${minutosAtivos} min` : 'menos de um minuto'} />
            {r.tempoDescansoMs > 0 && <Linha rotulo="Descanso" valor={`${Math.round(r.tempoDescansoMs / 60_000)} min`} />}
            {r.tempoBufferingMs > 1000 && (
              <Linha
                rotulo="Tempo perdido carregando"
                valor={`${Math.round(r.tempoBufferingMs / 1000)}s — não contamos como treino`}
              />
            )}
          </ul>

          <div className="aviso">
            <div>
              <p style={{ margin: 0, fontSize: 'var(--t-apoio)' }}>
                Registramos o que foi <strong>reproduzido</strong>. Isso não é uma
                medida do esforço do seu corpo — só você sabe como foi. Se quiser
                corrigir algo, o registro é editável no seu histórico.
              </p>
            </div>
          </div>

          <div className="acoes">
            <Link className="botao botao-primario" para="/hoje">Voltar para hoje</Link>
            <Link className="botao botao-secundario" para="/conquistas">Ver minha constância</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--e-4)', paddingBottom: 'var(--e-3)', borderBottom: '1px solid var(--linha)' }}>
      <span style={{ fontSize: 'var(--t-etiqueta)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tinta-70)' }}>
        {rotulo}
      </span>
      <span style={{ fontSize: 'var(--t-apoio)', fontWeight: 500 }}>{valor}</span>
    </li>
  );
}
