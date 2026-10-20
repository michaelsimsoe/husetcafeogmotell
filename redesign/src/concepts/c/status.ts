import { hoursStatus, clock, osloNow, mountHours, type HoursStatus } from '@lib/hours';

/** The status line in this concept's voice: «Åpent i kveld til 21». */
export function phrase(s: HoursStatus, now = new Date()): string {
  if (s.isOpen) {
    const close = clock(s.today.close);
    if ((s.minutesLeft ?? 999) <= 60) return `Åpent – stenger om ${s.minutesLeft} min`;
    return osloNow(now).minutes >= 15 * 60 ? `Åpent i kveld til ${close}` : `Åpent nå, til ${close} i kveld`;
  }
  if (s.next?.when === 'i dag') return `Stengt nå · åpner ${clock(s.next.day.open)} i dag`;
  if (s.next) return `Stengt for i kveld · åpner ${clock(s.next.day.open)} i morgen`;
  return s.text;
}

export function mountStatus() {
  mountHours();
  const run = () => {
    const s = hoursStatus();
    const text = phrase(s);
    document.querySelectorAll<HTMLElement>('[data-status-text]').forEach((el) => {
      el.textContent = text;
    });
  };
  run();
  window.setInterval(run, 60_000);
}
