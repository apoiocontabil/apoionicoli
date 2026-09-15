import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { navegar } from '../lib/rota';
import type { Usuario } from '../App';

/**
 * ONBOARDING — curto e progressivo (seção 13 do briefing).
 *
 * Decisões que este arquivo respeita:
 *  · Uma pergunta por vez, com progresso visível e volta possível.
 *  · **Câmera e microfone não são pedidos aqui.** Nem menção.
 *  · **Peso e altura não são pedidos aqui.** São opcionais, editáveis e ficam
 *    na área de evolução — recomendar pelo peso seria errado.
 *  · Toda pergunta pode ser pulada; a recomendação usa o conjunto do que
 *    houver, não um campo isolado.
 *  · O que a pessoa responde **muda a seleção de aulas de verdade**: tempo,
 *    espaço e impacto são exatamente os filtros do catálogo.
 */

interface Resposta {
  objetivo?: string;
  experiencia?: string;
  diasPorSemana?: number;
  minutosPorSessao?: number;
  espaco?: string;
  impactoMaximo?: string;
  equipamentos: string[];
  limitacoesInformadas?: string;
}

interface Pergunta {
  id: keyof Resposta | 'limitacoes';
  titulo: string;
  apoio?: string;
  tipo: 'escolha' | 'multipla' | 'texto';
  opcoes?: Array<{ valor: string; rotulo: string; nota?: string }>;
  /** Converte a escolha para o formato do perfil. */
  numero?: boolean;
}

const PERGUNTAS: Pergunta[] = [
  {
    id: 'objetivo',
    titulo: 'O que te traz aqui?',
    apoio: 'Isso orienta a ordem das aulas. Dá para mudar depois.',
    tipo: 'escolha',
    opcoes: [
      { valor: 'retomar uma rotina', rotulo: 'Retomar uma rotina' },
      { valor: 'ganhar força', rotulo: 'Ganhar força' },
      { valor: 'melhorar mobilidade', rotulo: 'Soltar o corpo' },
      { valor: 'manter constância', rotulo: 'Manter o que já faço' },
    ],
  },
  {
    id: 'experiencia',
    titulo: 'Como está sua experiência com treino?',
    apoio: 'Não existe resposta certa. Serve para começar no lugar certo.',
    tipo: 'escolha',
    opcoes: [
      { valor: 'iniciante', rotulo: 'Estou começando' },
      { valor: 'retomando', rotulo: 'Já treinei, parei um tempo' },
      { valor: 'constante', rotulo: 'Treino com alguma regularidade' },
    ],
  },
  {
    id: 'diasPorSemana',
    titulo: 'Quantos dias por semana você consegue?',
    apoio: 'Prefira o número que cabe numa semana difícil, não numa semana ideal.',
    tipo: 'escolha',
    numero: true,
    opcoes: [
      { valor: '2', rotulo: '2 dias' },
      { valor: '3', rotulo: '3 dias' },
      { valor: '4', rotulo: '4 dias' },
      { valor: '5', rotulo: '5 ou mais' },
    ],
  },
  {
    id: 'minutosPorSessao',
    titulo: 'Quanto tempo cabe numa sessão?',
    apoio: 'Este é o filtro que mais muda o que a gente te mostra.',
    tipo: 'escolha',
    numero: true,
    opcoes: [
      { valor: '10', rotulo: '10 minutos' },
      { valor: '12', rotulo: '12 minutos' },
      { valor: '20', rotulo: '20 minutos' },
      { valor: '30', rotulo: '30 minutos ou mais' },
    ],
  },
  {
    id: 'espaco',
    titulo: 'Quanto espaço você tem?',
    apoio: 'Aulas que não cabem no seu espaço não vão aparecer.',
    tipo: 'escolha',
    opcoes: [
      { valor: 'tapete', rotulo: 'Só um tapete', nota: 'cabe deitada com os braços abertos' },
      { valor: 'pequeno', rotulo: 'Uma sala pequena', nota: 'dá para dar dois passos' },
      { valor: 'medio', rotulo: 'Tenho espaço', nota: 'dá para me deslocar' },
    ],
  },
  {
    id: 'impactoMaximo',
    titulo: 'Pode fazer saltos?',
    apoio: 'Vizinho embaixo, articulação sensível, hora do dia — o motivo é seu.',
    tipo: 'escolha',
    opcoes: [
      { valor: 'sem_saltos', rotulo: 'Prefiro sem saltos' },
      { valor: 'baixo', rotulo: 'Impacto baixo, tudo bem' },
      { valor: 'moderado', rotulo: 'Pode puxar' },
    ],
  },
  {
    id: 'equipamentos',
    titulo: 'Tem algum equipamento?',
    apoio: 'Pode marcar mais de um, ou nenhum. Todas as aulas funcionam sem.',
    tipo: 'multipla',
    opcoes: [
      { valor: 'tapete', rotulo: 'Tapete' },
      { valor: 'elastico', rotulo: 'Elástico' },
      { valor: 'halter', rotulo: 'Halteres' },
      { valor: 'cadeira', rotulo: 'Uma cadeira firme' },
    ],
  },
  {
    id: 'limitacoes',
    titulo: 'Tem algo que devemos evitar?',
    apoio:
      'Opcional. Escreva com suas palavras — por exemplo, "joelho direito incomoda ao agachar". ' +
      'Isso fica no seu perfil e não vira diagnóstico nem prescrição.',
    tipo: 'texto',
  },
];

export function Onboarding({ usuario }: { usuario: Usuario | null }) {
  const [passo, setPasso] = useState(0);
  const [resposta, setResposta] = useState<Resposta>({ equipamentos: [] });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) navegar('/entrar');
  }, [usuario]);

  if (!usuario) return null;

  const p = PERGUNTAS[passo];
  const ultima = passo === PERGUNTAS.length - 1;
  const progresso = (passo + 1) / PERGUNTAS.length;

  function responder(valor: string) {
    if (p.tipo === 'multipla') {
      setResposta(r => ({
        ...r,
        equipamentos: r.equipamentos.includes(valor)
          ? r.equipamentos.filter(x => x !== valor)
          : [...r.equipamentos, valor],
      }));
      return;
    }
    setResposta(r => ({ ...r, [p.id]: p.numero ? Number(valor) : valor }));
    // Escolha única avança sozinha: menos um toque, sem prender ninguém.
    if (!ultima) setTimeout(() => setPasso(x => x + 1), 180);
  }

  async function concluir() {
    setSalvando(true);
    setErro(null);
    try {
      await api('/v1/perfil', { metodo: 'PATCH', corpo: resposta });
      navegar('/hoje');
    } catch (e: any) {
      setErro(e.message ?? 'Não conseguimos salvar agora.');
      setSalvando(false);
    }
  }

  const valorAtual = p.id === 'limitacoes' ? resposta.limitacoesInformadas : (resposta as any)[p.id];

  return (
    <section className="secao estreita" aria-labelledby="titulo-onboarding">
      <p className="etiqueta">Pergunta {passo + 1} de {PERGUNTAS.length}</p>

      <div
        className="progresso"
        role="progressbar"
        aria-valuenow={passo + 1}
        aria-valuemin={1}
        aria-valuemax={PERGUNTAS.length}
        aria-label="Progresso das perguntas"
      >
        <i style={{ width: `${progresso * 100}%`, background: 'var(--argila)' }} />
      </div>

      {/* A pergunta é um h1: quem usa leitor de tela ouve a mudança de contexto. */}
      <h1 className="titulo-m" id="titulo-onboarding" style={{ marginTop: 'var(--e-6)' }}>
        {p.titulo}
      </h1>
      {p.apoio && <p className="apoio">{p.apoio}</p>}

      {p.tipo === 'texto' ? (
        <div className="campo">
          <label htmlFor="limitacoes" className="sr">{p.titulo}</label>
          <textarea
            id="limitacoes"
            rows={4}
            value={resposta.limitacoesInformadas ?? ''}
            onChange={e => setResposta(r => ({ ...r, limitacoesInformadas: e.target.value }))}
            placeholder="Se não houver nada, pode deixar em branco."
          />
        </div>
      ) : (
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="sr">{p.titulo}</legend>
          <div className="opcoes-empilhadas">
            {p.opcoes!.map(o => {
              const marcada =
                p.tipo === 'multipla'
                  ? resposta.equipamentos.includes(o.valor)
                  : String(valorAtual ?? '') === o.valor;
              return (
                <button
                  key={o.valor}
                  type="button"
                  className="opcao-larga"
                  aria-pressed={marcada}
                  onClick={() => responder(o.valor)}
                >
                  <span>{o.rotulo}</span>
                  {o.nota && <small>{o.nota}</small>}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {erro && <p className="erro" role="alert">{erro}</p>}

      <div className="acoes">
        {passo > 0 && (
          <button type="button" className="botao botao-secundario" onClick={() => setPasso(x => x - 1)}>
            Voltar
          </button>
        )}

        {ultima ? (
          <button type="button" className="botao botao-primario" onClick={concluir} disabled={salvando}>
            {salvando ? 'Salvando…' : 'Terminar'}
          </button>
        ) : (
          <button type="button" className="botao botao-secundario" onClick={() => setPasso(x => x + 1)}>
            {valorAtual || (p.tipo === 'multipla' && resposta.equipamentos.length) ? 'Continuar' : 'Pular esta'}
          </button>
        )}
      </div>

      <p className="apoio" style={{ marginTop: 'var(--e-7)', fontSize: 13 }}>
        Nada aqui é obrigatório e tudo é editável depois. Não pedimos peso, altura,
        câmera nem microfone para montar sua rotina.
      </p>
    </section>
  );
}
