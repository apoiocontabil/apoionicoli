import type { Intervalo } from './tipos.js';

/**
 * União normalizada de intervalos de mídia.
 *
 * Existe para responder uma pergunta específica do briefing: "este trecho foi
 * REALMENTE reproduzido?". Assistir não comprova execução física, mas pular um
 * trecho comprova que ele não foi reproduzido — e por isso não pode creditar
 * execução (invariante 3 da seção 15).
 */

/** Junta intervalos sobrepostos ou contíguos e os devolve ordenados. */
export function unir(intervalos: Intervalo[]): Intervalo[] {
  const validos = intervalos
    .filter(i => i.fimMs > i.inicioMs)
    .sort((a, b) => a.inicioMs - b.inicioMs);
  if (validos.length === 0) return [];

  const saida: Intervalo[] = [{ ...validos[0] }];
  for (const atual of validos.slice(1)) {
    const ultimo = saida[saida.length - 1];
    if (atual.inicioMs <= ultimo.fimMs) {
      ultimo.fimMs = Math.max(ultimo.fimMs, atual.fimMs);
    } else {
      saida.push({ ...atual });
    }
  }
  return saida;
}

/** Soma, em ms, da parte de `alvo` coberta por `intervalos`. */
export function cobertura(intervalos: Intervalo[], alvo: Intervalo): number {
  if (alvo.fimMs <= alvo.inicioMs) return 0;
  let total = 0;
  for (const i of unir(intervalos)) {
    const ini = Math.max(i.inicioMs, alvo.inicioMs);
    const fim = Math.min(i.fimMs, alvo.fimMs);
    if (fim > ini) total += fim - ini;
  }
  return total;
}

/** Fração de `alvo` coberta, de 0 a 1. */
export function fracaoCoberta(intervalos: Intervalo[], alvo: Intervalo): number {
  const duracao = alvo.fimMs - alvo.inicioMs;
  if (duracao <= 0) return 0;
  return cobertura(intervalos, alvo) / duracao;
}

/**
 * Fração mínima de uma etapa que precisa ter sido reproduzida para creditá-la.
 *
 * Não é 1.0 de propósito: buffering, troca de faixa de áudio e o último quadro
 * produzem lacunas de poucos décimos que não significam que a pessoa pulou o
 * exercício. Também não é baixa a ponto de creditar quem assistiu ao começo e
 * arrastou até o fim.
 */
export const COBERTURA_MINIMA_PARA_CREDITO = 0.9;
