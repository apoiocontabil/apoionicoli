import { useEffect, useRef } from 'react';
import {
  amortecer, easeInOutCubic, easeOutExpo, faixa, lacoDeAnimacao,
  passagem, prefereMovimentoReduzido,
} from '../design/movimento';
import './claro.css';

/**
 * O CLARO — o gesto autoral da marca.
 *
 * Uma fresta de luz se alarga até virar o retângulo onde está a pessoa real
 * treinando na própria sala. Abre no começo da jornada (chegada) e FECHA no
 * fim (conclusão da aula): a casa volta a ser casa.
 *
 * Três relógios separados, como exige a seção 10:
 *  · o relógio da NARRATIVA, que produz a pose base;
 *  · o relógio da INTERAÇÃO, que nunca para, nem com a narrativa pausada;
 *  · o tempo da MÍDIA, que é do player e não desta cena.
 *
 * A pose base é restaurada a cada quadro ANTES do offset do ponteiro, então a
 * interação nunca acumula transformação.
 */

export type SentidoDoClaro = 'abrindo' | 'fechando' | 'aberto';

export interface PropsClaro {
  /** Fontes da mídia. WebM primeiro, MP4 depois (ver docs/MEDIA-SOURCES.md). */
  webmUrl: string;
  mp4Url: string;
  posterUrl: string;
  verticalWebmUrl?: string | null;
  verticalMp4Url?: string | null;
  verticalPosterUrl?: string | null;
  /** Descrição para quem não vê o vídeo. Obrigatória. */
  descricao: string;
  sentido?: SentidoDoClaro;
  /** Duração da abertura, em segundos. */
  duracao?: number;
  /** Marca o conteúdo como ilustrativo, não como aula da plataforma. */
  ilustrativo?: boolean;
  /** Chamado quando a abertura (ou o fechamento) termina. */
  aoTerminar?: () => void;
  /**
   * Quando `false`, o claro NÃO desenha o próprio gesso — a página já tem o
   * ambiente. Escopar o gesso ao componente desenha uma moldura em volta do
   * vídeo, e o claro precisa parecer luz abrindo, não um quadro pendurado.
   */
  ambiente?: boolean;
  className?: string;
}

export function Claro({
  webmUrl, mp4Url, posterUrl,
  verticalWebmUrl, verticalMp4Url, verticalPosterUrl,
  descricao, sentido = 'abrindo', duracao = 3.4, ilustrativo = false,
  aoTerminar, ambiente = true, className = '',
}: PropsClaro) {
  const raizRef = useRef<HTMLDivElement>(null);
  const claroRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const feixeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const terminouRef = useRef(false);

  useEffect(() => {
    const raiz = raizRef.current;
    const claro = claroRef.current;
    const halo = haloRef.current;
    const feixe = feixeRef.current;
    const video = videoRef.current;
    if (!raiz || !claro || !halo || !feixe) return;

    const reduzido = prefereMovimentoReduzido();
    const inicio = performance.now();
    terminouRef.current = false;

    // Relógio da interação: próprio, amortecido, sempre ativo.
    let px = 0.5, py = 0.35, alvoX = 0.5, alvoY = 0.35;
    let pendente = true;

    /** Pose base determinística no instante `t`, em segundos. */
    const pose = (t: number): void => {
      const p = sentido === 'aberto'
        ? 1
        : sentido === 'fechando'
          ? 1 - easeInOutCubic(faixa(t, 0.1, duracao * 0.75))
          : 0; // 'abrindo' calcula abaixo, em dois tempos

      if (sentido === 'abrindo') {
        // Altura primeiro, largura depois: a fresta vira retângulo.
        const abreY = easeOutExpo(faixa(t, 0.35, duracao * 0.44));
        const abreX = easeOutExpo(faixa(t, 0.55, duracao * 0.56));
        claro.style.clipPath = `inset(${(1 - abreY) * 49.6}% ${(1 - abreX) * 46}% ${(1 - abreY) * 49.6}% ${(1 - abreX) * 46}% round 2px)`;
        halo.style.opacity = String(0.9 * easeOutExpo(faixa(t, 0.5, duracao * 0.65)));
        if (video) {
          // A câmera assenta: entra aproximada e recua até a escala natural.
          const assenta = easeInOutCubic(faixa(t, 0.35, duracao * 0.88));
          video.style.transform = `scale(${(1.14 - 0.14 * assenta).toFixed(4)})`;
        }
      } else {
        const fecha = sentido === 'aberto' ? 1 : p;
        claro.style.clipPath = `inset(${(1 - fecha) * 49.6}% ${(1 - fecha) * 46}% ${(1 - fecha) * 49.6}% ${(1 - fecha) * 46}% round 2px)`;
        halo.style.opacity = String(0.9 * fecha);
        if (video) video.style.transform = `scale(${(1 + 0.06 * (1 - fecha)).toFixed(4)})`;
      }

      // O feixe atravessa uma única vez, no meio do movimento.
      const brilho = passagem(t, duracao * 0.32, duracao * 0.74);
      feixe.style.opacity = String(brilho * 0.5);
      feixe.style.transform = `translate3d(${(-40 + 80 * easeInOutCubic(faixa(t, duracao * 0.32, duracao * 0.74))).toFixed(2)}%,0,0)`;
    };

    const parar = lacoDeAnimacao((agora, delta) => {
      const t = reduzido ? duracao : Math.min((agora - inicio) / 1000, duracao);

      pose(t); // sempre restaura a pose base antes do offset da interação

      px = amortecer(px, alvoX, 0.07, delta);
      py = amortecer(py, alvoY, 0.07, delta);

      raiz.style.setProperty('--lx', `${(px * 100).toFixed(2)}%`);
      raiz.style.setProperty('--ly', `${(py * 100).toFixed(2)}%`);
      claro.style.translate = `${((px - 0.5) * -14).toFixed(2)}px ${((py - 0.5) * -10).toFixed(2)}px`;
      halo.style.translate = `${((px - 0.5) * -26).toFixed(2)}px ${((py - 0.5) * -18).toFixed(2)}px`;

      if (t >= duracao && !terminouRef.current) {
        terminouRef.current = true;
        aoTerminar?.();
      }

      // Continua enquanto a narrativa não acabou OU a interação ainda se move.
      const narrativaViva = t < duracao;
      const interacaoViva = Math.abs(px - alvoX) > 0.001 || Math.abs(py - alvoY) > 0.001;
      pendente = narrativaViva || interacaoViva;
      return pendente;
    });

    // O ponteiro move a fonte de luz da cena. Vale também com a narrativa
    // terminada — a página inteira continua respondendo.
    let despertar: (() => void) | null = null;
    const aoMover = (e: PointerEvent) => {
      const r = raiz.getBoundingClientRect();
      alvoX = (e.clientX - r.left) / r.width;
      alvoY = (e.clientY - r.top) / r.height;
      if (!pendente) despertar?.();
    };
    const aoSair = () => {
      alvoX = 0.5;
      alvoY = 0.35;
      if (!pendente) despertar?.();
    };

    // Quando o laço para por estabilidade, um novo movimento precisa religá-lo.
    despertar = () => {
      pendente = true;
      const rearme = lacoDeAnimacao((agora, delta) => {
        px = amortecer(px, alvoX, 0.07, delta);
        py = amortecer(py, alvoY, 0.07, delta);
        raiz.style.setProperty('--lx', `${(px * 100).toFixed(2)}%`);
        raiz.style.setProperty('--ly', `${(py * 100).toFixed(2)}%`);
        claro.style.translate = `${((px - 0.5) * -14).toFixed(2)}px ${((py - 0.5) * -10).toFixed(2)}px`;
        halo.style.translate = `${((px - 0.5) * -26).toFixed(2)}px ${((py - 0.5) * -18).toFixed(2)}px`;
        const vivo = Math.abs(px - alvoX) > 0.001 || Math.abs(py - alvoY) > 0.001;
        if (!vivo) rearme();
        return vivo;
      });
    };

    raiz.addEventListener('pointermove', aoMover, { passive: true });
    raiz.addEventListener('pointerleave', aoSair, { passive: true });

    // Hook determinístico de inspeção e de captura de evidência.
    (window as any).__claroSeek = (s: number) => pose(s);

    return () => {
      parar();
      raiz.removeEventListener('pointermove', aoMover);
      raiz.removeEventListener('pointerleave', aoSair);
      delete (window as any).__claroSeek;
    };
  }, [sentido, duracao, aoTerminar]);

  return (
    <div ref={raizRef} className={`claro-raiz ${className}`}>
      {ambiente && <div className="claro-gesso" aria-hidden="true" />}
      <div ref={haloRef} className="claro-halo" aria-hidden="true" />

      <div ref={claroRef} className="claro-janela">
        <video
          ref={videoRef}
          poster={posterUrl}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          aria-label={descricao}
        >
          {/* Vertical primeiro nas telas estreitas: recorte, nunca esticada. */}
          {verticalWebmUrl && <source src={verticalWebmUrl} type="video/webm" media="(max-aspect-ratio: 3/4)" />}
          {verticalMp4Url && <source src={verticalMp4Url} type="video/mp4" media="(max-aspect-ratio: 3/4)" />}
          <source src={webmUrl} type="video/webm" />
          <source src={mp4Url} type="video/mp4" />
          {/* Sem vídeo, o poster continua no lugar e a composição não quebra. */}
          <img src={posterUrl} alt={descricao} />
        </video>

        {ilustrativo && (
          <p className="claro-etiqueta">
            Imagem ilustrativa — não é uma aula da plataforma
          </p>
        )}
      </div>

      <div ref={feixeRef} className="claro-feixe" aria-hidden="true" />
    </div>
  );
}
