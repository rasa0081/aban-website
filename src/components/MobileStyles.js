'use client';
// Global mobile style improvements
export default function MobileStyles() {
  return (
    <style jsx global>{`
      /* ── Mobile Global Improvements ── */
      @media (max-width: 900px) {

        /* Smooth scrolling */
        html { scroll-behavior: smooth; }

        /* Better touch targets */
        button, a { min-height: 44px; }

        /* Card hover → active state on touch */
        .mobile-card:active { transform: scale(0.98) !important; }

        /* Fade in animation for page content */
        @keyframes mobileFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-fade-in {
          animation: mobileFadeIn 0.5s ease-out forwards;
        }

        /* Better pill carousel on mobile */
        .pill-carousel-mobile {
          transform: scale(0.85);
          transform-origin: center top;
        }

        /* Glassmorphism cards */
        .glass-card {
          background: rgba(255,255,255,0.85) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }

        /* Typography scale */
        h1 { font-size: 1.8rem !important; }
        h2 { font-size: 1.5rem !important; }
        h3 { font-size: 1.2rem !important; }
      }
    `}</style>
  );
}