import { useEffect, useState } from 'react';
import { api, ErroDaApi } from '../lib/api';

/**
 * Tela de planos.
 *
 * Os preços são HIPÓTESES de estudo, e a tela diz isso antes de qualquer número.
 * Nada de preço riscado sem base, cronômetro que reinicia, escassez falsa,
 * depoimento fictício ou "mais escolhido" sem dado real (seção 24.6).
 */
export function Planos() {
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [resposta, setResposta] = useState<{ mensagem: string; pendencias: string[] } | null>(null);

  useEffect(() => {
    api('/v1/planos').then(setDados).catch(e => setErro(e.message));
  }, []);

  async function tentarContratar(planoId: string) {
    try {
      await api('/v1/assinatura/contratar', { metodo: 'POST', corpo: { planoId } });
    } catch (e) {
      if (e instanceof ErroDaApi) {
        setResposta({ mensagem: e.message, pendencias: e.detalhe?.pendencias ?? [] });
      }
    }
  }

  if (erro) return <section className="secao"><p className="erro" role="alert">{erro}</p></section>;
  if (!dados) return <section className="secao"><p className="apoio">Carregando…</p></section>;

  return (
    <section className="secao" aria-labelledby="titulo-planos">
      <p className="etiqueta">Planos</p>
      <h1 className="titulo-m" id="titulo-planos">Duas opções em estudo</h1>

      {/* O aviso vem ANTES do preço, não em letra miúda no rodapé. */}
      <div className="aviso">
        <div>
          <p style={{ margin: '0 0 var(--e-2)' }}>
            <strong>{dados.avisos.precoEmEstudo}</strong>
          </p>
          <p style={{ margin: 0, fontSize: 'var(--t-apoio)' }}>
            Os valores abaixo são hipóteses para pesquisa. Não são uma oferta, e
            nenhum meio de pagamento está ligado a esta tela.
          </p>
        </div>
      </div>

      <div className="grade" style={{ marginTop: 'var(--e-6)' }}>
        {dados.planos.map((p: any) => (
          <article key={p.id} className="cartao" style={{ padding: 'var(--e-5)' }}>
            <h2 className="titulo-p">{p.nome}</h2>

            <p style={{ margin: '0 0 var(--e-1)', fontFamily: 'var(--fonte-display)', fontSize: 34, fontWeight: 300 }}>
              {(p.precoCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: p.moeda })}
              <span style={{ fontSize: 14, fontFamily: 'var(--fonte-texto)', color: 'var(--tinta-70)' }}> / mês</span>
            </p>
            <p style={{ margin: '0 0 var(--e-4)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--argila)' }}>
              hipótese de estudo
            </p>

            {/* "Recomendado para…" com a adequação explicada — nunca "mais escolhido". */}
            <p style={{ margin: '0 0 var(--e-2)', fontSize: 'var(--t-apoio)', fontWeight: 500 }}>
              Recomendado para {p.recomendadoPara}
            </p>
            <p style={{ margin: '0 0 var(--e-4)', fontSize: 'var(--t-apoio)', color: 'var(--tinta-70)' }}>
              {p.justificativaDaRecomendacao}
            </p>

            <h3 style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tinta-70)', margin: '0 0 var(--e-2)' }}>
              Inclui
            </h3>
            <ul style={{ margin: '0 0 var(--e-4)', paddingLeft: '1.1em', fontSize: 'var(--t-apoio)' }}>
              {p.capacidades.map((c: string) => <li key={c}>{nomeDaCapacidade(c)}</li>)}
            </ul>

            {p.cotas.length > 0 && (
              <>
                <h3 style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tinta-70)', margin: '0 0 var(--e-2)' }}>
                  Limites, em unidades compreensíveis
                </h3>
                <ul style={{ margin: '0 0 var(--e-4)', paddingLeft: '1.1em', fontSize: 'var(--t-apoio)' }}>
                  {p.cotas.map((c: any) => (
                    <li key={c.capacidade}>
                      {c.incluido} {c.unidade}
                      {!c.excedenteDisponivel && ' — sem cobrança automática de excedente'}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="acoes" style={{ marginTop: 'auto' }}>
              <button type="button" className="botao botao-secundario" onClick={() => tentarContratar(p.id)}>
                Por que não dá para assinar ainda?
              </button>
            </div>
          </article>
        ))}
      </div>

      {resposta && (
        <div className="aviso" role="status" style={{ marginTop: 'var(--e-6)' }}>
          <div>
            <p style={{ margin: '0 0 var(--e-2)' }}><strong>{resposta.mensagem}</strong></p>
            <ul style={{ margin: 0, paddingLeft: '1.1em', fontSize: 'var(--t-apoio)' }}>
              {resposta.pendencias.map(x => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      )}

      <hr className="fio" />

      <h2 className="titulo-p">Não depende de plano</h2>
      <p className="apoio">
        Controle da sessão, pausar e retomar, acessibilidade, privacidade,
        exportar e excluir seus dados, suporte de acesso e cancelamento. Essas
        coisas não são moeda de troca.
      </p>

      <div className="aviso">
        <div>
          <p style={{ margin: 0, fontSize: 'var(--t-apoio)' }}>
            {dados.avisos.assistenciaNaoEhProfissional}
          </p>
        </div>
      </div>
      <div className="aviso">
        <div>
          <p style={{ margin: 0, fontSize: 'var(--t-apoio)' }}>{dados.avisos.beneficioFisico}</p>
        </div>
      </div>
    </section>
  );
}

function nomeDaCapacidade(c: string): string {
  return {
    aulas_publicadas: 'Todas as aulas publicadas',
    programas: 'Programas com progressão',
    explicacoes: 'Explicações de cada exercício',
    historico: 'Histórico do que você fez',
    recomendacao_por_regras: 'Sugestão diária pelo seu perfil',
    motor_de_sessao: 'Pausar, retomar e trocar por alternativa',
    continuidade_entre_dispositivos: 'Continuar em outro aparelho',
    conquistas_digitais: 'Conquistas da sua jornada',
    assistencia_generativa: 'Assistência contextual por conversa',
    assistencia_voz: 'Assistência por voz',
    personalizacao_ampliada: 'Personalização ampliada',
    receitas_revisadas: 'Receitas e organização alimentar revisadas',
    avaliacao_corporal_manual: 'Registro de medidas com procedência',
    visao_experimental: 'Recursos de câmera (experimentais)',
    beneficio_fisico_quando_houver_programa: 'Elegibilidade a benefícios físicos, quando houver programa',
  }[c] ?? c;
}
