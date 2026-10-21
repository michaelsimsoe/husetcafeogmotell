/**
 * Opening hours: live «open now» status and compact groupings, in Norwegian or English.
 * Pure functions, no site data, so the browser bundle stays small and the tests can load it directly.
 */
import type { Locale } from '../i18n/locales.ts';

export interface OpeningDay {
  /** 0 = Monday. */
  day: number;
  label: string;
  short: string;
  open: string; // "HH:MM"
  close: string; // "HH:MM"
  closed: boolean;
}

export interface HoursStatus {
  isOpen: boolean;
  today: OpeningDay;
  /** Minutes until closing when open. */
  minutesLeft?: number;
  /** Next opening when closed. */
  next?: { day: OpeningDay; when: string };
  /** Short sentence, e.g. «Åpent nå · stenger 21» / «Open now · closes at 21:00». */
  text: string;
  /** Even shorter, e.g. «Åpent til 21» / «Open until 21:00». */
  short: string;
}

const WD: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

/** Weekday (0 = Monday) and minutes since midnight in Europe/Oslo. */
export function osloNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Oslo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { weekday: WD[get('weekday')] ?? 0, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** «21» for 21:00, «21.30» for 21:30 — Norwegian clock style. English keeps the 24-hour «21:00». */
export const clock = (hhmm: string, locale: Locale = 'nb') => {
  if (locale === 'en') return hhmm;
  const [h, m] = hhmm.split(':');
  return m === '00' ? String(Number(h)) : `${Number(h)}.${m}`;
};

/** «10–21», or «stengt». */
export const span = (d: OpeningDay, locale: Locale = 'nb') =>
  d.closed ? (locale === 'en' ? 'closed' : 'stengt') : `${clock(d.open, locale)}–${clock(d.close, locale)}`;

/** The status sentences, per language. */
const say = {
  nb: {
    open: (left: number, close: string) => (left <= 60 ? `Åpent nå · stenger om ${left} min` : `Åpent nå · stenger ${close}`),
    openShort: (close: string) => `Åpent til ${close}`,
    today: 'i dag',
    tomorrow: 'i morgen',
    on: (day: OpeningDay) => `på ${day.label.toLowerCase()}`,
    later: (open: string) => `Stengt nå · åpner ${open} i dag`,
    opens: (open: string, when?: string) => `Åpner ${open}${when ? ` ${when}` : ''}`,
    next: (closedToday: boolean, open: string, when: string) =>
      `${closedToday ? 'Stengt i dag' : 'Stengt for i dag'} · åpner ${open} ${when}`,
    closed: 'Stengt',
    closedToday: 'Stengt i dag',
  },
  en: {
    open: (left: number, close: string) => (left <= 60 ? `Open now · closes in ${left} min` : `Open now · closes at ${close}`),
    openShort: (close: string) => `Open until ${close}`,
    today: 'today',
    tomorrow: 'tomorrow',
    on: (day: OpeningDay) => `on ${day.label}`,
    later: (open: string) => `Closed now · opens at ${open} today`,
    opens: (open: string, when?: string) => `Opens at ${open}${when ? ` ${when}` : ''}`,
    next: (closedToday: boolean, open: string, when: string) =>
      `${closedToday ? 'Closed today' : 'Closed for the day'} · opens at ${open} ${when}`,
    closed: 'Closed',
    closedToday: 'Closed today',
  },
} satisfies Record<Locale, unknown>;

export function hoursStatus(days: readonly OpeningDay[], date = new Date(), locale: Locale = 'nb'): HoursStatus {
  const t = say[locale];
  const c = (hhmm: string) => clock(hhmm, locale);
  const { weekday, minutes } = osloNow(date);
  const today = days[weekday];

  if (!today.closed) {
    const open = toMin(today.open);
    const close = toMin(today.close);
    if (minutes >= open && minutes < close) {
      const left = close - minutes;
      return {
        isOpen: true,
        today,
        minutesLeft: left,
        text: t.open(left, c(today.close)),
        short: t.openShort(c(today.close)),
      };
    }
    if (minutes < open) {
      return {
        isOpen: false,
        today,
        next: { day: today, when: t.today },
        text: t.later(c(today.open)),
        short: t.opens(c(today.open)),
      };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const d = days[(weekday + i) % 7];
    if (d.closed) continue;
    const when = i === 1 ? t.tomorrow : t.on(d);
    return {
      isOpen: false,
      today,
      next: { day: d, when },
      text: t.next(today.closed, c(d.open), when),
      short: t.opens(c(d.open), when),
    };
  }
  return { isOpen: false, today, text: t.closed, short: t.closed };
}

export interface DayGroup {
  label: string;
  short: string;
  /** «10–21» or «stengt». */
  time: string;
}

/** Runs of days with the same hours: «Mandag–fredag 10–21», «Lørdag 11–21», … / «Monday–Friday 10:00–21:00» */
export function groupDays(days: readonly OpeningDay[], locale: Locale = 'nb'): DayGroup[] {
  const groups: OpeningDay[][] = [];
  for (const d of days) {
    const last = groups.at(-1);
    if (last && span(last[0]) === span(d)) last.push(d);
    else groups.push([d]);
  }
  // Norwegian writes weekday names in lower case mid-phrase; English capitalises them.
  const second = (name: string) => (locale === 'nb' ? name.toLowerCase() : name);
  return groups.map((g) => {
    const a = g[0];
    const b = g[g.length - 1];
    const one = g.length === 1;
    return {
      label: one ? a.label : `${a.label}–${second(b.label)}`,
      short: one ? a.short : `${a.short}–${second(b.short)}`,
      time: span(a, locale),
    };
  });
}

/**
 * Fill every element carrying `data-hours="text|short|today|state"` with live
 * status. Call from a client <script>. Re-runs every minute.
 */
export function mountHours(days: readonly OpeningDay[], root: ParentNode = document, locale: Locale = 'nb') {
  if (days.length !== 7) return;
  const run = () => {
    const s = hoursStatus(days, new Date(), locale);
    root.querySelectorAll<HTMLElement>('[data-hours]').forEach((el) => {
      const kind = el.dataset.hours;
      if (kind === 'text') el.textContent = s.text;
      else if (kind === 'short') el.textContent = s.short;
      else if (kind === 'today') el.textContent = s.today.closed ? say[locale].closedToday : span(s.today, locale);
      else if (kind === 'state') el.dataset.state = s.isOpen ? 'open' : 'closed';
    });
    root.querySelectorAll<HTMLElement>('[data-hours-day]').forEach((el) => {
      el.toggleAttribute('data-today', Number(el.dataset.hoursDay) === s.today.day);
    });
  };
  run();
  window.setInterval(run, 60_000);
}
