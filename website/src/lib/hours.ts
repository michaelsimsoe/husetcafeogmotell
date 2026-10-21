/**
 * Opening hours: live «open now» status and compact groupings.
 * Pure functions, no site data, so the browser bundle stays small and the tests can load it directly.
 */

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
  /** Short sentence in Bokmål, e.g. «Åpent nå · stenger 21». */
  text: string;
  /** Even shorter, e.g. «Åpent til 21» / «Åpner 10». */
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

/** «21» for 21:00, «21.30» for 21:30 — Norwegian clock style. */
export const clock = (hhmm: string) => {
  const [h, m] = hhmm.split(':');
  return m === '00' ? String(Number(h)) : `${Number(h)}.${m}`;
};

/** «10–21», or «stengt». */
export const span = (d: OpeningDay) => (d.closed ? 'stengt' : `${clock(d.open)}–${clock(d.close)}`);

export function hoursStatus(days: readonly OpeningDay[], date = new Date()): HoursStatus {
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
        text: left <= 60 ? `Åpent nå · stenger om ${left} min` : `Åpent nå · stenger ${clock(today.close)}`,
        short: `Åpent til ${clock(today.close)}`,
      };
    }
    if (minutes < open) {
      return {
        isOpen: false,
        today,
        next: { day: today, when: 'i dag' },
        text: `Stengt nå · åpner ${clock(today.open)} i dag`,
        short: `Åpner ${clock(today.open)}`,
      };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const d = days[(weekday + i) % 7];
    if (d.closed) continue;
    const when = i === 1 ? 'i morgen' : `på ${d.label.toLowerCase()}`;
    return {
      isOpen: false,
      today,
      next: { day: d, when },
      text: `${today.closed ? 'Stengt i dag' : 'Stengt for i dag'} · åpner ${clock(d.open)} ${when}`,
      short: `Åpner ${clock(d.open)} ${when}`,
    };
  }
  return { isOpen: false, today, text: 'Stengt', short: 'Stengt' };
}

export interface DayGroup {
  label: string;
  short: string;
  /** «10–21» or «stengt». */
  time: string;
}

/** Runs of days with the same hours: «Mandag–fredag 10–21», «Lørdag 11–21», … */
export function groupDays(days: readonly OpeningDay[]): DayGroup[] {
  const groups: OpeningDay[][] = [];
  for (const d of days) {
    const last = groups.at(-1);
    if (last && span(last[0]) === span(d)) last.push(d);
    else groups.push([d]);
  }
  return groups.map((g) => {
    const a = g[0];
    const b = g[g.length - 1];
    const one = g.length === 1;
    return {
      label: one ? a.label : `${a.label}–${b.label.toLowerCase()}`,
      short: one ? a.short : `${a.short}–${b.short.toLowerCase()}`,
      time: span(a),
    };
  });
}

/**
 * Fill every element carrying `data-hours="text|short|today|state"` with live
 * status. Call from a client <script>. Re-runs every minute.
 */
export function mountHours(days: readonly OpeningDay[], root: ParentNode = document) {
  if (days.length !== 7) return;
  const run = () => {
    const s = hoursStatus(days);
    root.querySelectorAll<HTMLElement>('[data-hours]').forEach((el) => {
      const kind = el.dataset.hours;
      if (kind === 'text') el.textContent = s.text;
      else if (kind === 'short') el.textContent = s.short;
      else if (kind === 'today') el.textContent = s.today.closed ? 'Stengt i dag' : span(s.today);
      else if (kind === 'state') el.dataset.state = s.isOpen ? 'open' : 'closed';
    });
    root.querySelectorAll<HTMLElement>('[data-hours-day]').forEach((el) => {
      el.toggleAttribute('data-today', Number(el.dataset.hoursDay) === s.today.day);
    });
  };
  run();
  window.setInterval(run, 60_000);
}
