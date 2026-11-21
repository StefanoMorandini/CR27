import { castles, lanes, laneCenters, MARK_VIEWBOX } from "./paths";

/** Punti di partenza prolungati sotto la base, così la maschera copre anche gli angoli inferiori. */
const maskStarts = ["M150 765L", "M392 760L", "M655 760L"];

type Props = {
  /** Anima corsie e castelli all'ingresso */
  animated?: boolean;
  /** Mostra i "corridori" che corrono lungo le corsie (in loop) */
  runners?: boolean;
  className?: string;
  title?: string;
  /** Prefisso univoco per gli id SVG (se il logo appare più volte nella pagina) */
  id?: string;
};

/**
 * Marchio ufficiale (castelli + corsie) in SVG.
 * Con `animated`: le corsie si disegnano lungo la curva e i castelli emergono uno dopo l'altro.
 */
export function LogoMark({ animated = false, runners = false, className, title, id = "mark" }: Props) {
  const castleList = [castles.left, castles.center, castles.right];
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {animated && (
        <defs>
          {laneCenters.map((c, i) => (
            <mask key={i} id={`${id}-lane-${i}`} maskUnits="userSpaceOnUse">
              <path
                d={maskStarts[i] + c.slice(1)}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={230}
                className="lane-draw"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </mask>
          ))}
          {/* I castelli escono "dal terreno": tagliati sotto la propria base */}
          <clipPath id={`${id}-ground-0`}>
            <rect x="0" y="0" width="1500" height="566" />
          </clipPath>
          <clipPath id={`${id}-ground-1`}>
            <rect x="0" y="0" width="1500" height="483" />
          </clipPath>
          <clipPath id={`${id}-ground-2`}>
            <rect x="0" y="0" width="1500" height="446" />
          </clipPath>
          <clipPath id={`${id}-lanes`}>
            {lanes.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </clipPath>
          <radialGradient id={`${id}-runner`}>
            <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
      )}

      <g fill="currentColor">
        {castleList.map((d, i) =>
          animated ? (
            <g key={i} clipPath={`url(#${id}-ground-${i})`}>
              <path d={d} className={`castle-rise c${i + 1}`} />
            </g>
          ) : (
            <path key={i} d={d} />
          ),
        )}
        {lanes.map((d, i) => (
          <path key={i} d={d} mask={animated ? `url(#${id}-lane-${i})` : undefined} />
        ))}
      </g>

      {animated && runners && (
        <g className="runners" clipPath={`url(#${id}-lanes)`}>
          {laneCenters.map((c, i) => {
            const dur = [3.4, 3.1, 3.7][i];
            return (
              <ellipse key={i} rx="70" ry="26" fill={`url(#${id}-runner)`} opacity="0">
                <animateMotion
                  path={c}
                  dur={`${dur}s`}
                  begin={`${1.8 + i * 0.25}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  calcMode="spline"
                  keyTimes="0;0.75;1"
                  keyPoints="0;1;1"
                  keySplines="0.45 0 0.25 1;0 0 1 1"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0;0"
                  keyTimes="0;0.08;0.62;0.75;1"
                  dur={`${dur}s`}
                  begin={`${1.8 + i * 0.25}s`}
                  repeatCount="indefinite"
                />
              </ellipse>
            );
          })}
        </g>
      )}
    </svg>
  );
}
