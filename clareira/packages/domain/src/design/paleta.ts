/**
 * Paleta da direção "Claro" — fonte de verdade única.
 *
 * As cores saíram da própria mídia escolhida (o vaso de terracota, as plantas,
 * a luz de janela dos clipes de `docs/MEDIA-SOURCES.md`), e não de uma paleta
 * padrão. É por isso que a interface e o vídeo não brigam.
 *
 * `apps/web/src/design/tokens.css` espelha estes valores como custom
 * properties. `test/paleta.test.ts` verifica os contrastes E verifica que o CSS
 * não saiu de sincronia com este arquivo.
 */

export const paleta = {
  /** Fundo principal claro — o gesso da parede com luz. */
  papel: '#f6f2ea',
  /** Superfície secundária e bordas de área — a sombra própria do gesso. */
  areia: '#e9e1d3',
  /** Texto principal e ação primária. Preto quente, nunca neutro frio. */
  tinta: '#17140f',
  /** Acento em texto e estados ativos. */
  argila: '#994f2f',
  /** O mesmo acento em uso gráfico e display grande, onde 3:1 basta. */
  argilaViva: '#a85a36',
  /** O claro, halos e destaque de progresso. PROIBIDO PARA TEXTO sobre papel. */
  luz: '#e7b064',
  /** Confirmação, constância e conquistas — as plantas do quadro real. */
  oliva: '#5d6b46',
  /** Fundo do estúdio de treino — a sala com a luz concentrada no tapete. */
  noite: '#14120f',
} as const;

export type CorDaPaleta = keyof typeof paleta;

/** Opacidade do texto de apoio sobre fundo claro. */
export const OPACIDADE_APOIO = 0.68;

// ---------------------------------------------------------------------------
// Cálculo de contraste (WCAG 2.1). Implementado aqui para que a regra de
// acessibilidade seja executável e não uma tabela escrita à mão que envelhece.
// ---------------------------------------------------------------------------

function canalLinear(valor: number): number {
  const c = valor / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`cor inválida: ${hex}`);
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

export function luminancia(hex: string): number {
  const [r, g, b] = rgb(hex);
  return 0.2126 * canalLinear(r) + 0.7152 * canalLinear(g) + 0.0722 * canalLinear(b);
}

/** Razão de contraste entre duas cores opacas, de 1:1 a 21:1. */
export function contraste(a: string, b: string): number {
  const la = luminancia(a);
  const lb = luminancia(b);
  const [maior, menor] = la > lb ? [la, lb] : [lb, la];
  return (maior + 0.05) / (menor + 0.05);
}

/** Cor efetiva de `frente` com opacidade `alfa` composta sobre `fundo`. */
export function sobre(frente: string, alfa: number, fundo: string): string {
  const f = rgb(frente);
  const b = rgb(fundo);
  const m = f.map((v, i) => Math.round(v * alfa + b[i] * (1 - alfa)));
  return `#${m.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Pares de cor que a interface realmente usa, com o nível exigido.
 * `grafico` = elemento não textual ou texto grande (≥24px, ou ≥18.66px bold):
 * exige 3:1. `texto` exige 4.5:1.
 */
export const paresDeUso = [
  { nome: 'texto principal sobre papel', frente: paleta.tinta, fundo: paleta.papel, nivel: 'texto' },
  { nome: 'texto de apoio sobre papel', frente: sobre(paleta.tinta, OPACIDADE_APOIO, paleta.papel), fundo: paleta.papel, nivel: 'texto' },
  { nome: 'acento sobre papel', frente: paleta.argila, fundo: paleta.papel, nivel: 'texto' },
  { nome: 'acento sobre areia', frente: paleta.argila, fundo: paleta.areia, nivel: 'texto' },
  { nome: 'confirmacao sobre papel', frente: paleta.oliva, fundo: paleta.papel, nivel: 'texto' },
  { nome: 'botao primario', frente: paleta.papel, fundo: paleta.tinta, nivel: 'texto' },
  { nome: 'texto no estudio', frente: paleta.papel, fundo: paleta.noite, nivel: 'texto' },
  { nome: 'luz sobre noite', frente: paleta.luz, fundo: paleta.noite, nivel: 'texto' },
  { nome: 'display grande em acento vivo', frente: paleta.argilaViva, fundo: paleta.papel, nivel: 'grafico' },
  { nome: 'luz como elemento grafico sobre papel', frente: paleta.luz, fundo: paleta.papel, nivel: 'nenhum' },
] as const;

export const MINIMO = { texto: 4.5, grafico: 3, nenhum: 0 } as const;
