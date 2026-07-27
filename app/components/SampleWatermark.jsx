/**
 * Full-screen diagonal watermark shown when an invitation is flagged as a sample.
 *
 * Rendered as a sibling of the invitation (a direct child of <body>) so its
 * `position: fixed` is viewport-relative and its stacking order beats every
 * overlay in the app — envelope reveals and preloaders top out at z-[99999].
 *
 * `pointer-events-none` keeps the whole invitation fully interactive underneath.
 * The tiled SVG pattern is scroll-independent, so the mark covers every section.
 *
 * The text is drawn with a translucent white fill AND a dark stroke so it stays
 * legible on light and dark backgrounds alike (on light backgrounds the stroke
 * outlines the letters; on dark ones the fill carries them).
 */
export default function SampleWatermark({ text = 'Kodexlk SAMPLE' }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 2147483000 }}
    >
      <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Tile is wider than the ~313px text so each instance reads on its own
              instead of running into the next one ("…SAMPLEKodexlk SAMPLE…"). */}
          <pattern
            id="kodexlk-sample-watermark"
            patternUnits="userSpaceOnUse"
            width="460"
            height="210"
            patternTransform="rotate(-30)"
          >
            {/* font-family lives in `style`: CSS var() is unreliable in SVG presentation attributes */}
            <text
              x="20"
              y="140"
              fontSize="30"
              fontWeight="700"
              letterSpacing="3"
              fill="rgba(255, 255, 255, 0.5)"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="1"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {text}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kodexlk-sample-watermark)" />
      </svg>
    </div>
  );
}
