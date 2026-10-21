/**
 * Search engines may index the site only when it is the production deploy on
 * husetmotell.no. Netlify sets CONTEXT and URL at build time; local builds,
 * deploy previews and any staging site on *.netlify.app stay `noindex`.
 */
const host = (() => {
  try {
    return new URL(process.env.URL ?? '').hostname;
  } catch {
    return '';
  }
})();

export const indexable =
  process.env.FORCE_INDEX === 'true' || (process.env.CONTEXT === 'production' && /(^|\.)husetmotell\.no$/.test(host));
