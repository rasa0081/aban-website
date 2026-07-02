// Returns anchor props so that EXTERNAL links (full http/https URLs) open in a
// new tab, while INTERNAL links (relative paths like "/about") open in the same
// tab. mailto:/tel: links are treated as internal (no new tab).
//
// Usage:  <Button {...linkProps(someHref)}>...</Button>
export const isExternalLink = (href) => /^https?:\/\//i.test(href || '');

export const linkProps = (href) =>
  isExternalLink(href)
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href };