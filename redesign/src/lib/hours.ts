import { site, type OpeningDay } from '@data/site';

export interface HoursStatus {
  isOpen: boolean;
  today: OpeningDay;
  /** Minutes until closing when open. */
  minutesLeft?: number;
  /** Next opening when closed. */
  next?: { day: OpeningDay; when: 'i dag' | 'i morgen' | string };
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

export function hoursStatus(date = new Date(), days: readonly OpeningDay[] = site.hours.days): HoursStatus {
  const { weekday, minutes } = osloNow(date);
  const today = days[weekday];
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

  const tomorrow = days[(weekday + 1) % 7];
  return {
    isOpen: false,
    today,
    next: { day: tomorrow, when: 'i morgen' },
    text: `Stengt for i dag · åpner ${clock(tomorrow.open)} i morgen`,
    short: `Åpner ${clock(tomorrow.open)} i morgen`,
  };
}

/**
 * Fill every element carrying `data-hours="text|short|today|state"` with live
 * status. Call from a client <script>. Re-runs every minute.
 */
export function mountHours(root: ParentNode = document) {
  const run = () => {
    const s = hoursStatus();
    root.querySelectorAll<HTMLElement>('[data-hours]').forEach((el) => {
      const kind = el.dataset.hours;
      if (kind === 'text') el.textContent = s.text;
      else if (kind === 'short') el.textContent = s.short;
      else if (kind === 'today') el.textContent = `${clock(s.today.open)}–${clock(s.today.close)}`;
      else if (kind === 'state') el.dataset.state = s.isOpen ? 'open' : 'closed';
    });
    root.querySelectorAll<HTMLElement>('[data-hours-day]').forEach((el) => {
      el.toggleAttribute('data-today', Number(el.dataset.hoursDay) === s.today.day);
    });
  };
  run();
  window.setInterval(run, 60_000);
}
