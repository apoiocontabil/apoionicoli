/**
 * Sistema de movimento.
 *
 * Regra central: a POSE É FUNÇÃO DO TEMPO ABSOLUTO. `pose(t)` é pura — avançar,
 * voltar, pausar ou reiniciar produz exatamente a mesma composição, sempre.
 * Isso é o que torna a cena determinística e o que permite capturar evidência
 * reproduzível (seção 10 e item 8 da seção 7).
 */

export const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Progresso de 0 a 1 de `t` dentro da faixa [a, b]. */
export const faixa = (t: number, a: number, b: number): number => clamp01((t - a) / (b - a));

export const easeOutExpo = (t: number): number => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
export const easeOutQuint = (t: number): number => 1 - (1 - t) ** 5;
export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Meia onda de seno: sobe e volta a zero dentro da faixa. Para luz de passagem. */
export const passagem = (t: number, a: number, b: number): number => Math.sin(Math.PI * faixa(t, a, b));

/**
 * Amortecimento por quadro, independente da taxa de atualização.
 * Sem isso, a resposta ao ponteiro fica mais rápida a 120 Hz que a 60 Hz.
 */
export function amortecer(atual: number, alvo: number, fator: number, deltaMs: number): number {
  const k = 1 - Math.exp(-fator * (deltaMs / 16.67));
  return atual + (alvo - atual) * k;
}

export function prefereMovimentoReduzido(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Laço de animação que:
 *  · para quando a aba está oculta (não gasta bateria no bolso de ninguém);
 *  · para quando a cena chega ao fim E a interação estabiliza;
 *  · volta a rodar assim que qualquer uma das duas condições muda.
 */
export function lacoDeAnimacao(quadro: (agoraMs: number, deltaMs: number) => boolean): () => void {
  let id = 0;
  let anterior = performance.now();
  let rodando = false;

  const passo = (agora: number) => {
    const delta = Math.min(agora - anterior, 100); // aba em background devolve saltos enormes
    anterior = agora;
    const continuar = quadro(agora, delta);
    if (continuar && !document.hidden) id = requestAnimationFrame(passo);
    else rodando = false;
  };

  const iniciar = () => {
    if (rodando || document.hidden) return;
    rodando = true;
    anterior = performance.now();
    id = requestAnimationFrame(passo);
  };

  const aoMudarVisibilidade = () => {
    if (document.hidden) {
      cancelAnimationFrame(id);
      rodando = false;
    } else {
      iniciar();
    }
  };

  document.addEventListener('visibilitychange', aoMudarVisibilidade);
  iniciar();

  return () => {
    cancelAnimationFrame(id);
    rodando = false;
    document.removeEventListener('visibilitychange', aoMudarVisibilidade);
  };
}

/** Reinicia o laço depois de uma interação que exige novos quadros. */
export type Despertar = () => void;
