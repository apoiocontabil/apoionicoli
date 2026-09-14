import { useState } from 'react';
import { api, dispositivoId, guardarToken } from '../lib/api';
import { Link } from '../lib/rota';
import { Claro } from '../scenes/Claro';
import type { Usuario } from '../App';

/**
 * CENA 5 — ACESSO.
 *
 * O claro continua presente, reduzido, ao lado do formulário: é o MESMO
 * elemento da chegada, não outro. A relação entre mídia, mensagem e formulário
 * é preservada sem impor duas colunas fixas (seções 12 e 22.5).
 */
export function Entrar({ modo, aoEntrar }: { modo: 'entrar' | 'criar'; aoEntrar: (u: Usuario, contaNova: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const criando = modo === 'criar';

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const r = await api<{ token: string; usuario: Usuario }>(
        criando ? '/v1/acesso/cadastro' : '/v1/acesso/entrar',
        {
          metodo: 'POST',
          corpo: {
            email,
            senha,
            ...(criando ? { nome, fuso: Intl.DateTimeFormat().resolvedOptions().timeZone } : {}),
            dispositivo: dispositivoId(),
          },
        },
      );
      guardarToken(r.token);
      aoEntrar(r.usuario, criando);
    } catch (e: any) {
      setErro(e.message ?? 'Não conseguimos entrar agora.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="secao" aria-labelledby="titulo-acesso">
      <div className="acesso">
        {/* Em tela estreita o claro vira uma faixa curta: a relação entre
            mídia, mensagem e formulário é preservada, mas o botão de enviar
            não pode ficar abaixo da dobra empurrado por vídeo decorativo. */}
        <div className="acesso-claro">
          <Claro
            webmUrl="/media/sala-16x9.webm"
            mp4Url="/media/sala-16x9.mp4"
            posterUrl="/media/sala-16x9.jpg"
            verticalWebmUrl="/media/sala-9x16.webm"
            verticalMp4Url="/media/sala-9x16.mp4"
            verticalPosterUrl="/media/sala-9x16.jpg"
            descricao="Uma mulher treina na sala de casa, com luz de janela."
            sentido="aberto"
            ilustrativo
          />
        </div>

        <div className="acesso-forma">
          <h1 className="titulo-m" id="titulo-acesso">
            {criando ? 'Criar sua conta' : 'Entrar'}
          </h1>
          <p className="apoio">
            {criando
              ? 'Leva menos de um minuto. Depois você escolhe o seu ritmo.'
              : 'Seu treino continua de onde você parou.'}
          </p>

          <form onSubmit={enviar} noValidate>
            {criando && (
              <div className="campo">
                <label htmlFor="nome">Como quer ser chamada ou chamado</label>
                <input id="nome" name="nome" autoComplete="name" required value={nome} onChange={e => setNome(e.target.value)} />
              </div>
            )}

            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email" name="email" type="email" inputMode="email"
                autoComplete="email" required autoFocus
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha" name="senha" type="password"
                autoComplete={criando ? 'new-password' : 'current-password'}
                required minLength={criando ? 10 : undefined}
                value={senha} onChange={e => setSenha(e.target.value)}
                aria-describedby={criando ? 'dica-senha' : undefined}
              />
              {criando && <span className="dica" id="dica-senha">Pelo menos 10 caracteres.</span>}
            </div>

            {erro && <p className="erro" role="alert">{erro}</p>}

            <div className="acoes" style={{ marginTop: 'var(--e-4)' }}>
              <button type="submit" className="botao botao-primario" disabled={enviando}>
                {enviando ? 'Um instante…' : criando ? 'Criar conta' : 'Entrar'}
              </button>
              <Link className="botao botao-secundario" para={criando ? '/entrar' : '/criar-conta'}>
                {criando ? 'Já tenho conta' : 'Criar uma conta'}
              </Link>
            </div>
          </form>

          {!criando && <Recuperar />}

          <p className="apoio" style={{ marginTop: 'var(--e-6)', fontSize: 13 }}>
            Ambiente de demonstração: use <code>aluna@exemplo.local</code> com a
            senha <code>clareira-demo-2026</code>.
          </p>
        </div>
      </div>
    </section>
  );
}

function Recuperar() {
  const [aberto, setAberto] = useState(false);
  const [email, setEmail] = useState('');
  const [resposta, setResposta] = useState<{ mensagem: string; observacao?: string } | null>(null);

  if (!aberto) {
    return (
      <button type="button" className="botao-texto" onClick={() => setAberto(true)}>
        Esqueci minha senha
      </button>
    );
  }

  return (
    <form
      style={{ marginTop: 'var(--e-4)' }}
      onSubmit={async e => {
        e.preventDefault();
        const r = await api<{ mensagem: string; observacao?: string }>('/v1/acesso/recuperar', {
          metodo: 'POST',
          corpo: { email },
        });
        setResposta(r);
      }}
    >
      <div className="campo">
        <label htmlFor="email-rec">E-mail da conta</label>
        <input id="email-rec" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <button type="submit" className="botao botao-secundario">Enviar instruções</button>

      {resposta && (
        <div className="aviso" role="status">
          <div>
            <p style={{ margin: 0 }}>{resposta.mensagem}</p>
            {/* Estado real: o produto não finge ter enviado e-mail. */}
            {resposta.observacao && (
              <p style={{ margin: 'var(--e-2) 0 0', fontSize: 13 }}>{resposta.observacao}</p>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
