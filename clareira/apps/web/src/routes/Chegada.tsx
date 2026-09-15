import { useEffect, useRef, useState } from 'react';
import { Claro } from '../scenes/Claro';
import { Link, navegar, useLocal } from '../lib/rota';
import {
  api, minutos, textoDeEquipamento, textoDeEspaco, textoDeImpacto,
  type AulaResumo,
} from '../lib/api';
import { easeOutExpo, faixa, lacoDeAnimacao, prefereMovimentoReduzido } from '../design/movimento';
import type { Usuario } from '../App';

/**
 * CENA 1 — CHEGADA.
 *
 * Em três segundos a pessoa precisa entender que isto é treino conduzido, em
 * casa, no tempo dela — e conseguir agir. As duas ações estão disponíveis desde
 * o primeiro quadro: nada exige assistir à animação.
 */

const DURACAO = 3.4;

export function Chegada({ usuario }: { usuario: Usuario | null }) {
  const blocoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bloco = blocoRef.current;
    if (!bloco) return;
    const reduzido = prefereMovimentoReduzido();
    const linhas = [...bloco.querySelectorAll<HTMLElement>('[data-entra]')];
    const inicio = performance.now();

    return lacoDeAnimacao(agora => {
      const t = reduzido ? DURACAO : Math.min((agora - inicio) / 1000, DURACAO);
      for (const el of linhas) {
        const atraso = Number(el.dataset.entra ?? 0);
        const p = easeOutExpo(faixa(t, atraso, atraso + 0.8));
        el.style.opacity = String(p);
        el.style.transform = `translateY(${((1 - p) * 16).toFixed(2)}px)`;
      }
      return t < DURACAO;
    });
  }, []);

  return (
    <>
      <section className="chegada" aria-labelledby="titulo-chegada">
        <div className="chegada-claro">
          <Claro
            webmUrl="/media/sala-16x9.webm"
            mp4Url="/media/sala-16x9.mp4"
            posterUrl="/media/sala-16x9.jpg"
            verticalWebmUrl="/media/sala-9x16.webm"
            verticalMp4Url="/media/sala-9x16.mp4"
            verticalPosterUrl="/media/sala-9x16.jpg"
            descricao="Uma mulher faz afundos sobre um tapete azul na sala de casa, com luz de janela, sofá e plantas ao fundo."
            duracao={DURACAO}
            ambiente={false}
            ilustrativo
          />
        </div>

        <div className="chegada-bloco" ref={blocoRef}>
          <h1 className="titulo-g" id="titulo-chegada">
            <span data-entra="1.55" style={{ display: 'block', opacity: 0 }}>
              Abra <em>espaço</em>
            </span>
            <span data-entra="1.68" style={{ display: 'block', opacity: 0 }}>
              para o seu treino.
            </span>
          </h1>

          <p className="apoio" data-entra="2.0" style={{ opacity: 0, marginTop: 'var(--e-4)' }}>
            Aulas conduzidas por professores reais, no tempo que você tiver.
            Comece com 12 minutos na sua sala.
          </p>

          <div className="acoes" data-entra="2.15" style={{ opacity: 0 }}>
            <a className="botao botao-primario" href="#comecar">Ver uma aula</a>
            <Link className="botao botao-secundario" para={usuario ? '/hoje' : '/entrar'}>
              {usuario ? 'Ir para o meu treino' : 'Entrar'}
            </Link>
          </div>
        </div>

        <div className="chegada-ficha" data-entra="2.3">
          <ul className="ficha">
            <li>12 min</li>
            <li>sem equipamento</li>
            <li>sala pequena</li>
          </ul>
        </div>
      </section>

      <Descoberta />
      <ComoFunciona />
      <Professores />
      <Honestidade />
    </>
  );
}

/**
 * CENA 2 — O QUE CABE NO SEU TEMPO.
 *
 * Trocar um controle TROCA A AULA DE VERDADE: consulta o catálogo e devolve
 * conteúdo publicado. Nunca só o rótulo sobre o mesmo vídeo. O estado vive na
 * URL, então o resultado é compartilhável e o botão voltar funciona.
 */
function Descoberta() {
  const local = useLocal();
  const [aulas, setAulas] = useState<AulaResumo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sugestao, setSugestao] = useState<string | null>(null);

  const tempo = Number(local.consulta.get('minutos') ?? 12);
  const espaco = local.consulta.get('espaco') ?? 'tapete';
  const impacto = local.consulta.get('impacto') ?? 'sem_saltos';

  function ajustar(chave: string, valor: string) {
    const q = new URLSearchParams(local.consulta);
    q.set(chave, valor);
    navegar(`/?${q.toString()}#comecar`, { substituir: true });
  }

  useEffect(() => {
    const controle = new AbortController();
    setErro(null);
    api<{ aulas: AulaResumo[]; sugestaoSeVazio: string | null }>(
      `/v1/aulas?minutos=${tempo}&espaco=${espaco}&impacto=${impacto}`,
      { sinal: controle.signal },
    )
      .then(r => { setAulas(r.aulas); setSugestao(r.sugestaoSeVazio); })
      .catch(e => { if (e.name !== 'AbortError') setErro(e.message); });
    return () => controle.abort();
  }, [tempo, espaco, impacto]);

  return (
    <section className="secao" id="comecar" aria-labelledby="titulo-descoberta">
      <p className="etiqueta">Começar</p>
      <h2 className="titulo-m" id="titulo-descoberta">Quanto tempo você tem hoje?</h2>

      <div className="descoberta">
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="sr">Tempo disponível</legend>
          <div className="opcoes">
            {[10, 12, 20, 30].map(m => (
              <button
                key={m}
                type="button"
                className="opcao"
                aria-pressed={tempo === m}
                onClick={() => ajustar('minutos', String(m))}
              >
                {m} min
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="sr">Espaço disponível</legend>
          <div className="opcoes">
            {[
              ['tapete', 'Só um tapete'],
              ['pequeno', 'Sala pequena'],
              ['medio', 'Tenho espaço'],
            ].map(([v, r]) => (
              <button key={v} type="button" className="opcao" aria-pressed={espaco === v} onClick={() => ajustar('espaco', v)}>
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="sr">Impacto</legend>
          <div className="opcoes">
            {[
              ['sem_saltos', 'Sem saltos'],
              ['baixo', 'Impacto baixo'],
              ['moderado', 'Pode puxar'],
            ].map(([v, r]) => (
              <button key={v} type="button" className="opcao" aria-pressed={impacto === v} onClick={() => ajustar('impacto', v)}>
                {r}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {erro && <p className="erro" role="alert">{erro}</p>}

      {/* A região é live: quem usa leitor de tela percebe que o resultado mudou. */}
      <div aria-live="polite">
        {aulas === null && !erro && <p className="apoio">Procurando aulas que cabem aí…</p>}

        {aulas?.length === 0 && (
          <div className="vazio">
            <p style={{ margin: 0 }}>{sugestao ?? 'Nada encontrado com esses critérios.'}</p>
          </div>
        )}

        {aulas && aulas.length > 0 && (
          <>
            {/* A consequência da escolha fica explícita mesmo quando a lista
                não muda: o catálogo é pequeno e o silêncio pareceria inércia. */}
            <p className="apoio" style={{ maxWidth: '60ch' }}>
              {aulas.length === 1 ? 'Uma aula cabe' : `${aulas.length} aulas cabem`} em {tempo} minutos,
              {' '}{espaco === 'tapete' ? 'num tapete' : espaco === 'pequeno' ? 'numa sala pequena' : 'com espaço'},
              {' '}{impacto === 'sem_saltos' ? 'sem saltos' : impacto === 'baixo' ? 'com impacto baixo' : 'podendo puxar'}.
            </p>
            <div className="grade">
              {aulas.map(a => <CartaoDeAula key={a.id} aula={a} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export function CartaoDeAula({ aula }: { aula: AulaResumo }) {
  return (
    <Link className="cartao" para={`/aula/${aula.id}/preparar`}>
      <div className="cartao-midia">
        {aula.midia && <img src={aula.midia.posterUrl} alt="" loading="lazy" />}
      </div>
      <div className="cartao-corpo">
        <h3>{aula.titulo}</h3>
        <p>{aula.descricao}</p>
        <ul className="ficha" style={{ marginTop: 'auto', paddingTop: 'var(--e-3)' }}>
          <li>{minutos(aula.duracaoMs)} min</li>
          <li>{textoDeEquipamento(aula.equipamentos)}</li>
          <li>{textoDeEspaco(aula.espacoMinimo)}</li>
          <li>{textoDeImpacto(aula.impacto)}</li>
        </ul>
        <p style={{ fontSize: 12, marginTop: 'var(--e-2)' }}>com {aula.professor.nome}</p>
      </div>
    </Link>
  );
}

function ComoFunciona() {
  const passos = [
    ['Você diz o que tem', 'Tempo, espaço e equipamento. A seleção muda de verdade — não é um rótulo diferente sobre o mesmo vídeo.'],
    ['O professor conduz', 'Preparação, demonstração, séries e descanso marcados na aula. Se não entender um movimento, a explicação está a um toque.'],
    ['Você pode parar', 'Pausar e voltar sem perder onde estava, no mesmo aparelho ou em outro. Faltar alguns dias não apaga o seu histórico.'],
  ];
  return (
    <section className="secao" aria-labelledby="titulo-como">
      <p className="etiqueta">Como funciona</p>
      <h2 className="titulo-m" id="titulo-como">Feito para caber na sua rotina</h2>
      <div className="grade">
        {passos.map(([t, d]) => (
          <div key={t} className="cartao" style={{ padding: 'var(--e-5)' }}>
            <h3 className="titulo-p">{t}</h3>
            <p style={{ margin: 0, color: 'var(--tinta-70)', fontSize: 'var(--t-apoio)' }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Professores() {
  const [profs, setProfs] = useState<any[] | null>(null);
  useEffect(() => {
    api<{ professores: any[] }>('/v1/professores').then(r => setProfs(r.professores)).catch(() => setProfs([]));
  }, []);

  return (
    <section className="secao" aria-labelledby="titulo-profs">
      <p className="etiqueta">Quem conduz</p>
      <h2 className="titulo-m" id="titulo-profs">Professores reais</h2>
      {profs?.length ? (
        <div className="grade">
          {profs.map(p => (
            <div key={p.id} className="cartao" style={{ padding: 'var(--e-5)' }}>
              <h3 className="titulo-p">{p.nome}</h3>
              <p style={{ margin: '0 0 var(--e-2)', fontSize: 'var(--t-apoio)', color: 'var(--tinta-70)' }}>
                {p.especialidades.join(' · ')}
              </p>
              <p style={{ margin: 0, fontSize: 'var(--t-apoio)' }}>{p.apresentacao}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="apoio">Carregando a equipe…</p>
      )}
    </section>
  );
}

/**
 * O que ainda não existe. Fica na página pública porque influencia a decisão
 * de quem está avaliando o produto (seções 12 e 31).
 */
function Honestidade() {
  return (
    <section className="secao estreita" aria-labelledby="titulo-honestidade">
      <hr className="fio" />
      <h2 className="titulo-p" id="titulo-honestidade">O que ainda não está pronto</h2>
      <div className="aviso">
        <div>
          <p style={{ margin: '0 0 var(--e-2)' }}>
            <strong>Esta é uma versão em construção.</strong> Os vídeos que você vê
            são imagens ilustrativas licenciadas, não aulas da nossa equipe. Os
            professores mostrados são perfis de demonstração.
          </p>
          <p style={{ margin: 0 }}>
            Não há cobrança: nenhum preço foi aprovado e nenhum meio de pagamento
            está ligado. <Link para="/planos" className="botao-texto">Ver os planos em estudo</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
