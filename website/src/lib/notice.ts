/**
 * The owners' notice at the top of every page. Pure functions, so the tests can load this file directly.
 *
 * The build drops a notice whose last day has passed. Between builds, a small inline
 * script in Layout.astro removes it in the browser on the same rule, so no nightly
 * rebuild is needed.
 */

export interface Notice {
  text: string;
  /** Last day to show it, YYYY-MM-DD in Europe/Oslo. */
  until?: string;
}

/** Today in Europe/Oslo as YYYY-MM-DD. */
export const osloToday = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

/** The notice to show, or undefined when it is switched off, empty or past its last day. */
export function activeNotice(
  n: { show: boolean; text?: string; until?: string },
  today = osloToday(),
): Notice | undefined {
  if (!n.show || !n.text) return undefined;
  if (n.until && n.until < today) return undefined;
  return { text: n.text, until: n.until };
}
