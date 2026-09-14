import { useCallback, useEffect, useState } from 'react';

/**
 * Roteamento por History API, sem dependência externa.
 *
 * Requisitos da seção 11.2 que isto atende:
 *  · Toda rota abre DIRETO por URL, sem depender de assistir à cena anterior.
 *  · O botão voltar funciona e restaura a posição.
 *  · O estado de descoberta vive na URL, então um resultado é compartilhável.
 */

export interface Local {
  caminho: string;
  consulta: URLSearchParams;
}

function lerLocal(): Local {
  return {
    caminho: window.location.pathname,
    consulta: new URLSearchParams(window.location.search),
  };
}

const ouvintes = new Set<() => void>();

function avisar(): void {
  for (const o of ouvintes) o();
}

export function navegar(para: string, opcoes: { substituir?: boolean } = {}): void {
  if (opcoes.substituir) window.history.replaceState({}, '', para);
  else window.history.pushState({}, '', para);
  avisar();
  // Foco vai para o início do conteúdo a cada navegação: quem usa teclado ou
  // leitor de tela não fica preso no rodapé da tela anterior.
  requestAnimationFrame(() => {
    const alvo = document.getElementById('conteudo');
    if (alvo) {
      alvo.setAttribute('tabindex', '-1');
      alvo.focus({ preventScroll: true });
    }
  });
}

export function useLocal(): Local {
  const [local, setLocal] = useState<Local>(lerLocal);

  useEffect(() => {
    const atualizar = () => setLocal(lerLocal());
    ouvintes.add(atualizar);
    window.addEventListener('popstate', atualizar);
    return () => {
      ouvintes.delete(atualizar);
      window.removeEventListener('popstate', atualizar);
    };
  }, []);

  return local;
}

/** Casa `/sessao/:id` com `/sessao/abc` e devolve os parâmetros. */
export function casar(padrao: string, caminho: string): Record<string, string> | null {
  const p = padrao.split('/').filter(Boolean);
  const c = caminho.split('/').filter(Boolean);
  if (p.length !== c.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(c[i]);
    else if (p[i] !== c[i]) return null;
  }
  return params;
}

/** Link que respeita clique com modificador, botão do meio e alvo externo. */
export function Link(props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { para: string }) {
  const { para, onClick, children, ...resto } = props;
  const aoClicar = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navegar(para);
    },
    [para, onClick],
  );
  return (
    <a href={para} onClick={aoClicar} {...resto}>
      {children}
    </a>
  );
}
