import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { MINIMO, paleta, paresDeUso, contraste, sobre, OPACIDADE_APOIO } from '../src/design/paleta.js';

const aqui = dirname(fileURLToPath(import.meta.url));
const tokensCss = resolve(aqui, '../../../apps/web/src/design/tokens.css');

describe('paleta — contraste', () => {
  for (const par of paresDeUso) {
    const minimo = MINIMO[par.nivel];
    it(`${par.nome} atinge ${minimo}:1`, () => {
      const razao = contraste(par.frente, par.fundo);
      expect(razao, `${par.frente} sobre ${par.fundo} = ${razao.toFixed(2)}:1`).toBeGreaterThanOrEqual(minimo);
    });
  }

  it('a cor --luz continua reprovada para texto sobre papel', () => {
    // Regra de design, não acidente: se alguém "consertar" isso aumentando o
    // contraste da luz, perdemos o efeito de halo. O teste existe para que a
    // proibição de usá-la em texto seja uma decisão consciente e documentada.
    expect(contraste(paleta.luz, paleta.papel)).toBeLessThan(MINIMO.texto);
  });

  it('texto de apoio composto continua legível', () => {
    const efetivo = sobre(paleta.tinta, OPACIDADE_APOIO, paleta.papel);
    expect(contraste(efetivo, paleta.papel)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('paleta — sincronia com os tokens CSS', () => {
  const css = readFileSync(tokensCss, 'utf8');

  const mapa: Array<[string, string]> = [
    ['--papel', paleta.papel],
    ['--areia', paleta.areia],
    ['--tinta', paleta.tinta],
    ['--argila', paleta.argila],
    ['--argila-viva', paleta.argilaViva],
    ['--luz', paleta.luz],
    ['--oliva', paleta.oliva],
    ['--noite', paleta.noite],
  ];

  for (const [token, valor] of mapa) {
    it(`${token} no CSS é igual ao da fonte de verdade`, () => {
      const m = new RegExp(`${token}\\s*:\\s*(#[0-9a-fA-F]{6})`).exec(css);
      expect(m, `${token} não encontrado em tokens.css`).not.toBeNull();
      expect(m![1].toLowerCase()).toBe(valor.toLowerCase());
    });
  }
});
