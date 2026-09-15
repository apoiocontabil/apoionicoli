import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link } from '../lib/rota';

/**
 * CENA 4 — PROGRAMAS.
 *
 * Aqui a grade AJUDA a comparar, então a grade é usada — e só aqui.
 * Os critérios são os mesmos em todos os cartões, para a comparação ser real.
 */
export function Programas() {
  const [programas, setProgramas] = useState<any[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api<{ programas: any[] }>('/v1/programas').then(r => setProgramas(r.programas)).catch(e => setErro(e.message));
  }, []);

  return (
    <section className="secao" aria-labelledby="titulo-programas">
      <p className="etiqueta">Programas</p>
      <h1 className="titulo-m" id="titulo-programas">Caminhos com começo, meio e progressão</h1>
      <p className="apoio">
        Um programa organiza as aulas numa ordem que faz sentido. Você pode sair
        e voltar sem perder o lugar.
      </p>

      {erro && <p className="erro" role="alert">{erro}</p>}
      {programas === null && !erro && <p className="apoio">Carregando programas…</p>}

      {programas && (
        <div className="grade" style={{ marginTop: 'var(--e-6)' }}>
          {programas.map(p => (
            <article key={p.id} className="cartao" style={{ padding: 'var(--e-5)' }}>
              <h2 className="titulo-p">{p.titulo}</h2>
              <p style={{ margin: '0 0 var(--e-4)', color: 'var(--tinta-70)', fontSize: 'var(--t-apoio)' }}>
                {p.objetivo}
              </p>

              {/* Critérios comparáveis, iguais em todos os cartões. */}
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--e-2) var(--e-4)', fontSize: 'var(--t-apoio)' }}>
                <dt style={estiloRotulo}>Duração</dt>
                <dd style={estiloValor}>{p.semanas} semanas</dd>
                <dt style={estiloRotulo}>Frequência</dt>
                <dd style={estiloValor}>{p.sessoesPorSemana}× por semana</dd>
                <dt style={estiloRotulo}>Nível</dt>
                <dd style={estiloValor}>{p.nivel}</dd>
                <dt style={estiloRotulo}>Aulas</dt>
                <dd style={estiloValor}>{p.totalDeAulas}</dd>
                <dt style={estiloRotulo}>Equipamento</dt>
                <dd style={estiloValor}>{p.equipamentos.length ? p.equipamentos.join(', ') : 'nenhum'}</dd>
                <dt style={estiloRotulo}>Pré-requisito</dt>
                <dd style={estiloValor}>{p.preRequisitos.length ? p.preRequisitos.join('; ') : 'nenhum'}</dd>
                <dt style={estiloRotulo}>Professor</dt>
                <dd style={estiloValor}>{p.professor.nome}</dd>
              </dl>

              {p.oQueVoceAprende?.length > 0 && (
                <>
                  <h3 style={{ ...estiloRotulo, marginTop: 'var(--e-5)' }}>O que você aprende</h3>
                  <ul style={{ margin: 'var(--e-2) 0 0', paddingLeft: '1.1em', fontSize: 'var(--t-apoio)', color: 'var(--tinta-70)' }}>
                    {p.oQueVoceAprende.map((x: string) => <li key={x}>{x}</li>)}
                  </ul>
                </>
              )}

              <div className="acoes">
                <Link className="botao botao-secundario" para="/?minutos=20#comecar">Ver aulas deste nível</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const estiloRotulo: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--tinta-70)',
  margin: 0,
  fontWeight: 500,
};
const estiloValor: React.CSSProperties = { margin: 0 };
