import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { clock, groupDays, hoursStatus, osloNow, span, type OpeningDay } from '../src/lib/hours.ts';

const names = [
  ['Mandag', 'Man'],
  ['Tirsdag', 'Tir'],
  ['Onsdag', 'Ons'],
  ['Torsdag', 'Tor'],
  ['Fredag', 'Fre'],
  ['Lørdag', 'Lør'],
  ['Søndag', 'Søn'],
];

/** Mon–Fri 10–21, Sat 11–21, Sun closed. */
const week: OpeningDay[] = names.map(([label, short], day) => ({
  day,
  label,
  short,
  open: day === 5 ? '11:00' : '10:00',
  close: '21:00',
  closed: day === 6,
}));

// 2 June 2025 is a Monday; Oslo is UTC+2 in summer.
const summer = (day: number, hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(2025, 5, 2 + day, h - 2, m));
};

describe('osloNow', () => {
  it('reads the weekday and time in Oslo, not in the machine time zone', () => {
    assert.deepEqual(osloNow(new Date('2025-06-02T08:00:00Z')), { weekday: 0, minutes: 10 * 60 });
  });

  it('follows winter time', () => {
    // 6 January 2025 is a Monday; Oslo is UTC+1 in winter.
    assert.deepEqual(osloNow(new Date('2025-01-06T09:30:00Z')), { weekday: 0, minutes: 10 * 60 + 30 });
  });

  it('rolls over to the next day at Oslo midnight', () => {
    assert.equal(osloNow(new Date('2025-06-01T22:30:00Z')).weekday, 0);
  });
});

describe('hoursStatus', () => {
  it('is open from the opening minute', () => {
    const s = hoursStatus(week, summer(0, '10:00'));
    assert.equal(s.isOpen, true);
    assert.equal(s.text, 'Åpent nå · stenger 21');
    assert.equal(s.short, 'Åpent til 21');
  });

  it('counts down the last hour', () => {
    const s = hoursStatus(week, summer(0, '20:15'));
    assert.equal(s.minutesLeft, 45);
    assert.equal(s.text, 'Åpent nå · stenger om 45 min');
  });

  it('says when it opens later today', () => {
    const s = hoursStatus(week, summer(0, '09:00'));
    assert.equal(s.isOpen, false);
    assert.equal(s.text, 'Stengt nå · åpner 10 i dag');
  });

  it('is closed at the closing minute and points to tomorrow', () => {
    const s = hoursStatus(week, summer(0, '21:00'));
    assert.equal(s.isOpen, false);
    assert.equal(s.text, 'Stengt for i dag · åpner 10 i morgen');
    assert.equal(s.short, 'Åpner 10 i morgen');
  });

  it('skips a closed day and names the weekday', () => {
    const s = hoursStatus(week, summer(5, '22:00'));
    assert.equal(s.text, 'Stengt for i dag · åpner 10 på mandag');
  });

  it('says «stengt i dag» on a closed day', () => {
    const s = hoursStatus(week, summer(6, '12:00'));
    assert.equal(s.text, 'Stengt i dag · åpner 10 i morgen');
  });

  it('handles a week with no opening hours', () => {
    const closed = week.map((d) => ({ ...d, closed: true }));
    assert.equal(hoursStatus(closed, summer(2, '12:00')).text, 'Stengt');
  });
});

describe('formatting', () => {
  it('writes Norwegian clock times', () => {
    assert.equal(clock('21:00'), '21');
    assert.equal(clock('09:00'), '9');
    assert.equal(clock('21:30'), '21.30');
  });

  it('writes a day span or «stengt»', () => {
    assert.equal(span(week[0]), '10–21');
    assert.equal(span(week[6]), 'stengt');
  });

  it('groups runs of days with the same hours', () => {
    assert.deepEqual(groupDays(week), [
      { label: 'Mandag–fredag', short: 'Man–fre', time: '10–21' },
      { label: 'Lørdag', short: 'Lør', time: '11–21' },
      { label: 'Søndag', short: 'Søn', time: 'stengt' },
    ]);
  });

  it('does not group days that are apart', () => {
    const split = week.map((d) => (d.day === 2 ? { ...d, closed: true } : d));
    assert.deepEqual(
      groupDays(split).map((g) => g.label),
      ['Mandag–tirsdag', 'Onsdag', 'Torsdag–fredag', 'Lørdag', 'Søndag'],
    );
  });
});
