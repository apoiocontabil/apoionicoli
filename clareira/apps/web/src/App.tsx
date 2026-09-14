import { useEffect, useState } from 'react';
import { casar, Link, useLocal, navegar } from './lib/rota';
import { api, guardarToken, tokenSalvo } from './lib/api';
import { Chegada } from './routes/Chegada';
import { Entrar } from './routes/Entrar';
import { Hoje } from './routes/Hoje';
import { Preparar } from './routes/Preparar';
import { Estudio } from './routes/Estudio';
import { Fim } from './routes/Fim';
import { Programas } from './routes/Programas';
import { Planos } from './routes/Planos';
import { Conquistas } from './routes/Conquistas';
import { Studio } from './routes/Studio';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  fuso: string;
  papeis: string[];
}

export function App() {
  const local = useLocal();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    if (!tokenSalvo()) {
      setCarregandoSessao(false);
      return;
    }
    api<{ usuario: Usuario }>('/v1/acesso/eu')
      .then(r => setUsuario(r.usuario))
      .catch(() => {
        guardarToken(null);
        setUsuario(null);
      })
      .finally(() => setCarregandoSessao(false));
  }, []);

  async function sair() {
    await api('/v1/acesso/sair', { metodo: 'POST' }).catch(() => {});
    guardarToken(null);
    setUsuario(null);
    navegar('/');
  }

  const c = local.caminho;
  const autor = usuario?.papeis.some(p => ['instrutor', 'editor', 'admin'].includes(p));

  // A rota do estúdio de treino ocupa a tela inteira: sem cabeçalho, sem
  // qualquer oferta. Durante o esforço, nada disputa espaço (seção 14).
  const emSessao = Boolean(casar('/sessao/:id', c));

  let tela: React.ReactNode;
  let params: Record<string, string> | null;

  if (c === '/' ) tela = <Chegada usuario={usuario} />;
  else if (c === '/entrar' || c === '/criar-conta')
    tela = <Entrar modo={c === '/entrar' ? 'entrar' : 'criar'} aoEntrar={u => { setUsuario(u); navegar('/hoje'); }} />;
  else if (c === '/hoje') tela = <Hoje usuario={usuario} carregando={carregandoSessao} />;
  else if (c === '/programas') tela = <Programas />;
  else if (c === '/planos') tela = <Planos />;
  else if (c === '/conquistas') tela = <Conquistas usuario={usuario} />;
  else if (c === '/studio' || c.startsWith('/studio/')) tela = <Studio caminho={c} />;
  else if ((params = casar('/aula/:id/preparar', c))) tela = <Preparar aulaId={params.id} usuario={usuario} />;
  else if ((params = casar('/sessao/:id', c))) tela = <Estudio sessaoId={params.id} />;
  else if ((params = casar('/sessao/:id/fim', c))) tela = <Fim sessaoId={params.id} />;
  else tela = <NaoEncontrada />;

  return (
    <>
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>

      {!emSessao && (
        <header className="cabecalho">
          <Link para="/" className="marca" aria-label="Clareira — início">Clareira</Link>
          <nav className="nav" aria-label="Principal">
            {usuario ? (
              <>
                <Link para="/hoje">Hoje</Link>
                <Link para="/programas">Programas</Link>
                <Link para="/conquistas">Conquistas</Link>
                {autor && <Link para="/studio">Studio</Link>}
                <button type="button" className="botao-texto" onClick={sair}>Sair</button>
              </>
            ) : (
              <>
                <Link para="/programas">Programas</Link>
                <Link para="/planos">Planos</Link>
                <Link para="/entrar" className="acao-cabecalho">Entrar</Link>
              </>
            )}
          </nav>
        </header>
      )}

      <main id="conteudo">{tela}</main>
    </>
  );
}

function NaoEncontrada() {
  return (
    <section className="secao estreita">
      <h1 className="titulo-m">Não encontramos essa página</h1>
      <p className="apoio">
        O endereço pode ter mudado. Volte para o início ou veja os programas.
      </p>
      <div className="acoes">
        <Link para="/" className="botao botao-primario">Ir para o início</Link>
        <Link para="/programas" className="botao botao-secundario">Ver programas</Link>
      </div>
    </section>
  );
}
