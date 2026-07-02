'use client';

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

export default function SecurityGuard() {
  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    // ── Block right-click ──────────────────────────────────────────────────
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // ── Block select-all on the page (not in inputs/textareas) ────────────
    const handleSelectAll = (e) => {
      if (e.ctrlKey && ['a', 'A'].includes(e.key)) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (!['input', 'textarea'].includes(tag)) {
          e.preventDefault();
          return false;
        }
      }
    };

    // ── Block keyboard shortcuts ───────────────────────────────────────────
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12') { e.preventDefault(); return false; }
      // Ctrl+Shift+I/J/C (DevTools)
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) { e.preventDefault(); return false; }
      // Ctrl+U (View Source)
      if (e.ctrlKey && ['u', 'U'].includes(e.key)) { e.preventDefault(); return false; }
      // Ctrl+P (Print)
      if (e.ctrlKey && ['p', 'P'].includes(e.key)) { e.preventDefault(); return false; }
      // PrintScreen — blur content briefly
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setBlurred(true);
        setTimeout(() => setBlurred(false), 2000);
        return false;
      }
      // Windows+Shift+S (Snipping Tool) & Ctrl+Shift+S
      if (e.shiftKey && ['s', 'S'].includes(e.key) && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setBlurred(true);
        setTimeout(() => setBlurred(false), 2000);
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleSelectAll);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleSelectAll);
    };
  }, []);

  if (!blurred) return null;

  return (
    <Box sx={{
      position: 'fixed', inset: 0, zIndex: 99999,
      backdropFilter: 'blur(20px)',
      bgcolor: 'rgba(12,43,41,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} />
  );
}
