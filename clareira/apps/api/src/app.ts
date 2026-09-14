import { createServer, type Server } from 'node:http';
import type { Banco } from './db/index.js';
import { Roteador } from './lib/http.js';
import { rotasDeAcesso } from './routes/acesso.js';
import { rotasDeCatalogo } from './routes/catalogo.js';
import { rotasDeSessao } from './routes/sessoes.js';
import { rotasDeAutoria } from './routes/autoria.js';
import { rotasComerciais } from './routes/comercial.js';
import { rotasDeConquistas } from './routes/conquistas.js';

/**
 * Monta o roteador sobre um banco. Separado de `server.ts` para que os testes
 * exercitem exatamente as mesmas rotas contra um banco em memória — sem mock
 * de HTTP e sem uma segunda implementação para testar.
 */
export function criarRoteador(db: Banco): Roteador {
  const r = new Roteador();

  r.get('/v1/saude', () => ({
    ok: true,
    servico: 'clareira-api',
    integracoes: {
      pagamento: 'nao_configurado',
      video: 'nao_configurado',
      ia: 'nao_configurado',
      voz: 'nao_configurado',
      email: 'nao_configurado',
    },
  }));

  rotasDeAcesso(r, db);
  rotasDeCatalogo(r, db);
  rotasDeSessao(r, db);
  rotasDeAutoria(r, db);
  rotasComerciais(r, db);
  rotasDeConquistas(r, db);
  return r;
}

export function criarServidor(db: Banco, origens: string[]): Server {
  const roteador = criarRoteador(db);
  return createServer((req, res) => {
    roteador.atender(req, res, origens).catch(e => {
      console.error('falha não tratada no roteador', e);
      if (!res.writableEnded) res.writeHead(500).end();
    });
  });
}
