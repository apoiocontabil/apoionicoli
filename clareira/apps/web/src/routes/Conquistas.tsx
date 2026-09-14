import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { navegar } from '../lib/rota';
import type { Usuario } from '../App';

/**
 * Conquistas.
 *
 * Mostra o marco atual, o que já contou e o que falta — e por quê. Nunca expõe
 * detalhe de antifraude e nunca promete benefício que não está financiado.
 * O texto "em revisão" existe para que uma checagem não pareça uma punição.
 */
export function Conquistas({ usuario }: { usuario: Usuario | null }) {
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) { navegar('/entrar'); return; }
    api('/v1/conquistas').then(setDados).catch(e => setErro(e.message));
  }, [usuario]);

  if (!usuario) return null;
  if (erro) return <section className="secao"><p className="erro" role="alert">{erro}</p></section>;
  if (!dados) return <section className="secao"><p className="apoio">Carregando…</p></section>;

  const { progresso, marcos, regra } = dados;

  return (
    <section className="secao" aria-labelledby="titulo-conquistas">
      <p className="etiqueta">Sua jornada</p>
      <h1 className="titulo-m" id="titulo-conquistas">Constância, do seu jeito</h1>
      <p className="apoio">{regra.descricaoPublica}</p>

      {/* Se não há campanha, a tela diz isso — não insinua um prêmio futuro. */}
      {regra.aviso && (
        <div className="aviso">
          <div><p style={{ margin: 0 }}>{regra.aviso}</p></div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gap: 'var(--e-4)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          margin: 'var(--e-6) 0',
        }}
      >
        <Numero rotulo="Dias de participação" valor={progresso.diasDeParticipacao} />
        <Numero rotulo="Semanas de compromisso" valor={progresso.semanasDeCompromisso} />
        <Numero rotulo="Ciclos de assinatura" valor={progresso.ciclosPagosElegiveis} />
      </div>

      <h2 className="titulo-p">Marcos</h2>
      <ul className="pilha" style={{ listStyle: 'none', padding: 0 }}>
        {marcos.map((m: any) => (
          <li
            key={m.id}
            className="cartao"
            style={{ padding: 'var(--e-5)', borderColor: m.concedido ? 'var(--oliva)' : 'var(--linha)' }}
          >
            <div className="linha-entre">
              <div>
                <h3 style={{ margin: '0 0 var(--e-1)', fontSize: 17, fontWeight: 600 }}>{m.rotulo}</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--tinta-70)' }}>
                  {m.camada === 'jornada' ? 'Reconhecimento da jornada' : 'Benefício de fidelidade'}
                  {m.tipoBeneficio === 'fisico' && ' · envolveria um objeto físico'}
                </p>
              </div>
              <Selo m={m} />
            </div>

            {/* A explicação em linguagem do aluno: o que falta e por quê. */}
            <p style={{ margin: 'var(--e-3) 0 0', fontSize: 'var(--t-apoio)' }}>{m.explicacao}</p>

            {m.semanasExigidas > 0 && (
              <div className="progresso" style={{ background: 'var(--linha)' }}>
                <i
                  style={{
                    width: `${Math.min(100, ((m.semanasExigidas - m.faltam.semanas) / m.semanasExigidas) * 100)}%`,
                    background: m.concedido ? 'var(--oliva)' : 'var(--argila)',
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <hr className="fio" />
      <Recurso />
    </section>
  );
}

function Selo({ m }: { m: any }) {
  if (m.concedido) return <Etiqueta cor="var(--oliva)">Conquistado</Etiqueta>;
  if (m.emRevisao) return <Etiqueta cor="var(--argila)">Em revisão</Etiqueta>;
  if (m.elegivel) return <Etiqueta cor="var(--argila)">Disponível</Etiqueta>;
  return <Etiqueta cor="var(--tinta-70)">Em andamento</Etiqueta>;
}

function Etiqueta({ children, cor }: { children: React.ReactNode; cor: string }) {
  return (
    <span style={{
      fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase',
      color: cor, border: `1px solid ${cor}`, borderRadius: 999, padding: '4px 10px', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="cartao" style={{ padding: 'var(--e-5)' }}>
      <p style={{ margin: 0, fontFamily: 'var(--fonte-display)', fontSize: 40, fontWeight: 300, lineHeight: 1 }}>{valor}</p>
      <p style={{ margin: 'var(--e-2) 0 0', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tinta-70)' }}>
        {rotulo}
      </p>
    </div>
  );
}

function Recurso() {
  const [aberto, setAberto] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [resposta, setResposta] = useState<any>(null);

  return (
    <div>
      <h2 className="titulo-p">Alguma sessão não contou?</h2>
      <p className="apoio">
        Se o vídeo travou, você trocou de fuso ou o serviço ficou fora do ar, conte
        para a gente. Uma falha nossa não tira o seu progresso.
      </p>

      {!aberto ? (
        <button type="button" className="botao botao-secundario" onClick={() => setAberto(true)}>
          Contestar uma sessão
        </button>
      ) : (
        <form
          onSubmit={async e => {
            e.preventDefault();
            setResposta(await api('/v1/conquistas/recurso', { metodo: 'POST', corpo: { motivo } }));
          }}
        >
          <div className="campo">
            <label htmlFor="motivo">O que aconteceu?</label>
            <textarea id="motivo" rows={4} required value={motivo} onChange={e => setMotivo(e.target.value)} />
          </div>
          <button type="submit" className="botao botao-primario">Enviar</button>
        </form>
      )}

      {resposta && (
        <div className="aviso" role="status">
          <div>
            <p style={{ margin: '0 0 var(--e-2)' }}>{resposta.mensagem}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--tinta-70)' }}>
              Protocolo: {resposta.protocolo}. Fila de revisão humana:{' '}
              {resposta.revisaoHumana === 'pendente'
                ? 'ainda não há operação de atendimento por trás deste fluxo neste ambiente.'
                : resposta.revisaoHumana}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
