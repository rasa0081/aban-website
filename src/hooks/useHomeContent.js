'use client';
import { useState, useEffect } from 'react';
import { homeSectionsApi } from '../lib/api';
import { sectionsData, getSectionDefaults } from '../data/sectionsData';

// Build the fallback section list from the hardcoded sectionsData.js.
// Used when the DB has no rows yet or the request fails, so the homepage is
// never empty.
function fallbackSections() {
  return sectionsData.map((s, i) => {
    const buttons = s.heroButtons
      ? s.heroButtons.map(b => ({ text: b.text, link: b.link, variant: b.variant || 'contained' }))
      : (s.buttonText ? [{ text: s.buttonText, link: s.buttonLink || '#', variant: 'contained' }] : []);
    return {
      id: s.id,
      sectionKey: s.id,
      type: s.id === 'hero' ? 'hero' : 'card',
      title: s.title,
      subtitle: s.subtitle,
      buttons,
      order: i,
      visible: true,
      ...getSectionDefaults(s.id),
    };
  });
}

// Merge a DB row (text/links/order/visibility) with the visual defaults
// (icon/colors/pattern) resolved from sectionKey.
function hydrate(row) {
  const key = row.sectionKey;
  return {
    id: key,
    sectionKey: key,
    type: row.type || 'card',
    title: row.title,
    subtitle: row.subtitle || '',
    buttons: Array.isArray(row.buttons) ? row.buttons : [],
    order: row.order ?? 0,
    visible: row.visible !== false,
    ...getSectionDefaults(key),
  };
}

// Reads the admin-editable homepage sections (hero + cards) from the DB.
// Returns a single ordered `sections` array. Falls back to sectionsData.js
// if nothing has been seeded/customized yet.
export function useHomeContent() {
  const [sections, setSections] = useState(fallbackSections());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    homeSectionsApi.getAll()
      .then(rows => {
        if (Array.isArray(rows) && rows.length > 0) {
          const hydrated = rows.map(hydrate).sort((a, b) => a.order - b.order);
          setSections(hydrated);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const hero = sections.find(s => s.type === 'hero') || null;
  const cards = sections.filter(s => s.type !== 'hero');

  return { sections, hero, cards, loaded };
}
