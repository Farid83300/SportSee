// =============================================================================
// SPORTSEE — Composant AnimatedLogo
// Logo avec barres animées montant/descendant en boucle
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

export default function AnimatedLogo({ height = 23 }: { height?: number }) {
  const width = (height * 19) / 21;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 19 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SportSee logo"
    >
      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(0.4); }
        }

        .bar-pair { transform-box: fill-box; transform-origin: center; }

        .bar-1 { animation: barPulse 1.2s ease-in-out infinite; animation-delay: 0s;    }
        .bar-2 { animation: barPulse 1.2s ease-in-out infinite; animation-delay: 0.15s; }
        .bar-3 { animation: barPulse 1.2s ease-in-out infinite; animation-delay: 0.3s;  }
        .bar-4 { animation: barPulse 1.2s ease-in-out infinite; animation-delay: 0.45s; }
        .bar-5 { animation: barPulse 1.2s ease-in-out infinite; animation-delay: 0.6s;  }
      `}</style>

      <defs>
        <linearGradient id="g0" x1="5.5" y1="5.656" x2="5.5" y2="20.656" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4320B"/>
          <stop offset="1" stopColor="#5465F7"/>
        </linearGradient>
        <linearGradient id="g1" x1="8.5" y1="28" x2="8.5" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F99885"/>
          <stop offset="1" stopColor="#DF392B"/>
        </linearGradient>
        <linearGradient id="g2" x1="17.5" y1="11.328" x2="17.5" y2="17.328" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4320B"/>
          <stop offset="1" stopColor="#5465F7"/>
        </linearGradient>
        <linearGradient id="g3" x1="20.5" y1="28" x2="20.5" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F99885"/>
          <stop offset="1" stopColor="#DF392B"/>
        </linearGradient>
        <linearGradient id="g4" x1="13.5" y1="11" x2="13.5" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4320B"/>
          <stop offset="1" stopColor="#5465F7"/>
        </linearGradient>
        <linearGradient id="g5" x1="16.5" y1="23" x2="16.5" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F99885"/>
          <stop offset="1" stopColor="#DF392B"/>
        </linearGradient>
        <linearGradient id="g6" x1="9.5" y1="11.328" x2="9.5" y2="16.328" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4320B"/>
          <stop offset="1" stopColor="#5465F7"/>
        </linearGradient>
        <linearGradient id="g7" x1="12.5" y1="26" x2="12.5" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F99885"/>
          <stop offset="1" stopColor="#DF392B"/>
        </linearGradient>
        <linearGradient id="g8" x1="1.5" y1="11" x2="1.5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4320B"/>
          <stop offset="1" stopColor="#5465F7"/>
        </linearGradient>
        <linearGradient id="g9" x1="4.5" y1="25.328" x2="4.5" y2="14.328" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F99885"/>
          <stop offset="1" stopColor="#DF392B"/>
        </linearGradient>
      </defs>

      {/* Paire 1 — barre gauche */}
      <g className="bar-pair bar-1">
        <rect x="4" y="5.656" width="3" height="15" rx="1.5" fill="url(#g0)"/>
        <rect x="7" y="14" width="3" height="14" rx="1.5" transform="rotate(180 7 14)" fill="url(#g1)"/>
      </g>

      {/* Paire 2 */}
      <g className="bar-pair bar-2">
        <rect x="8" y="11.328" width="3" height="5" rx="1.5" fill="url(#g6)"/>
        <rect x="11" y="14" width="3" height="12" rx="1.5" transform="rotate(180 11 14)" fill="url(#g7)"/>
      </g>

      {/* Paire 3 — centre */}
      <g className="bar-pair bar-3">
        <rect x="12" y="11" width="3" height="9" rx="1.5" fill="url(#g4)"/>
        <rect x="15" y="14" width="3" height="9" rx="1.5" transform="rotate(180 15 14)" fill="url(#g5)"/>
      </g>

      {/* Paire 4 */}
      <g className="bar-pair bar-4">
        <rect x="16" y="11.328" width="3" height="6" rx="1.5" fill="url(#g2)"/>
        <rect x="19" y="14" width="3" height="14" rx="1.5" transform="rotate(180 19 14)" fill="url(#g3)"/>
      </g>

      {/* Paire 5 — barre droite */}
      <g className="bar-pair bar-5">
        <rect x="0" y="11" width="3" height="8" rx="1.5" fill="url(#g8)"/>
        <rect x="3" y="14.328" width="3" height="11" rx="1.5" transform="rotate(180 3 14.328)" fill="url(#g9)"/>
      </g>

    </svg>
  );
}
