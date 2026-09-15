import { useEffect, useState } from 'react';
import { api, dispositivoId, minutos, textoDeEquipamento, textoDeEspaco, textoDeImpacto, type AulaResumo } from '../lib/api';
import { Link, navegar } from '../lib/rota';
import type { Usuario } from '../App';

/**
 * CENA 7 — PREPARAÇÃO.
 *
 * "Você deve se sentir pronto, sem passar por um painel técnico."
 * Câmera e microfone NÃO são pedidos aqui. O modo com botões sempre funciona.
 */
export function Preparar({ aulaId, usuario }: { aulaId: string; usuario: Usuario | null }) {
  const [dados, setDados] = useState<{ aula: AulaResumo; versao: any } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [iniciando, setIniciando] = useState(false);

  useEffect(() => {
    api<{ aula: AulaResumo; versao: any }>(`/v1/aulas/${aulaId}`)
      .then(setDados)
      .catch(e => setErro(e.message));
  }, [aulaId]);

  async function comecar() {
    if (!usuario) { navegar('/entrar'); return; }
    setIniciando(true);
    setErro(null);
    try {
      const r = await api<{ sessao: { id: string } }>('/v1/sessoes', {
        metodo: 'POST',
        corpo: { aulaId, dispositivoId: dispositivoId() },
      });
      navegar(`/sessao/${r.sessao.id}`);
    } catch (e: any) {
      setErro(e.message);
      setIniciando(false);
    }
  }

  if (erro && !dados) return <section className="secao"><p className="erro" role="alert">{erro}</p></section>;
  if (!dados) return <section className="secao"><p className="apoio">Carregando a aula…</p></section>;

  const { aula, versao } = dados;
  const etapas = (versao?.etapas ?? []) as any[];
  const series = etapas.filter(e => e.creditavel).length;
  const temAlternativas = etapas.some(e => (e.alternativas ?? []).length > 0);

  return (
    <section className="secao" aria-labelledby="titulo-preparar">
      <p className="etiqueta">Antes de começar</p>
      <h1 className="titulo-m" id="titulo-preparar">{aula.titulo}</h1>
      <p className="apoio">{aula.descricao}</p>

      <div
        style={{
          display: 'grid',
          gap: 'var(--e-6)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          marginTop: 'var(--e-5)',
        }}
      >
        <div style={{ borderRadius: 'var(--raio-m)', overflow: 'hidden', aspectRatio: '16 / 9', background: 'var(--areia)', position: 'relative' }}>
          {aula.midia && <img src={aula.midia.posterUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          {aula.midia?.ilustrativo && (
            <p style={{
              position: 'absolute', right: 12, bottom: 12, margin: 0, padding: '6px 10px',
              borderRadius: 999, background: 'rgba(23,20,15,.86)', color: '#fff', fontSize: 10, maxWidth: '22ch',
            }}>
              Imagem ilustrativa — não é uma aula da plataforma
            </p>
          )}
        </div>

        <div>
          <h2 className="titulo-p">O que esperar</h2>
          <ul className="pilha" style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--e-5)' }}>
            <Item rotulo="Tempo" valor={`${minutos(aula.duracaoMs)} minutos no total`} />
            <Item rotulo="Equipamento" valor={textoDeEquipamento(aula.equipamentos)} />
            <Item rotulo="Espaço" valor={textoDeEspaco(aula.espacoMinimo)} />
            <Item rotulo="Intensidade" valor={textoDeImpacto(aula.impacto)} />
            <Item rotulo="Estrutura" valor={`${series} ${series === 1 ? 'série' : 'séries'}, com demonstração e descanso entre elas`} />
            {temAlternativas && <Item rotulo="Alternativas" valor="Há uma variação mais fácil disponível durante a aula" />}
            <Item rotulo="Professor" valor={aula.professor.nome} />
          </ul>

          <div className="aviso">
            <div>
              <p style={{ margin: 0 }}>
                O som começa só quando você quiser. <strong>Câmera e microfone não
                são necessários</strong> — todos os controles funcionam por botão.
              </p>
            </div>
          </div>

          {erro && <p className="erro" role="alert">{erro}</p>}

          <div className="acoes">
            <button type="button" className="botao botao-primario" onClick={comecar} disabled={iniciando}>
              {iniciando ? 'Preparando…' : usuario ? 'Estou pronta, começar' : 'Entrar para começar'}
            </button>
            <Link className="botao botao-secundario" para="/hoje">Voltar</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <li style={{ display: 'flex', gap: 'var(--e-4)', paddingBottom: 'var(--e-3)', borderBottom: '1px solid var(--linha)' }}>
      <span style={{ minWidth: '11ch', fontSize: 'var(--t-etiqueta)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tinta-70)' }}>
        {rotulo}
      </span>
      <span style={{ fontSize: 'var(--t-apoio)' }}>{valor}</span>
    </li>
  );
}
