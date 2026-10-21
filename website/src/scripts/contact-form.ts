/**
 * Progressive enhancement for components/ContactForm.astro.
 * The form works without this file (plain POST → the thanks page); with it,
 * errors are in the page's language, nothing reloads, and the sender is thanked by name.
 */
import { toLocale, type Locale } from '../i18n/locales';

type Field = HTMLInputElement | HTMLTextAreaElement;

const say = {
  nb: {
    nameMissing: 'Vi vil veldig gjerne ha navnet ditt.',
    messageMissing: 'Meldingen må inneholde noe. I det minste ett «Hei!».',
    emailInvalid: 'Sjekk e-postadressen. Den skal se omtrent slik ut: navn@eksempel.no',
    sending: 'Sender …',
  },
  en: {
    nameMissing: 'We’d really like to have your name.',
    messageMissing: 'The message needs to say something. A “Hi!” at the very least.',
    emailInvalid: 'Check the email address. It should look roughly like this: name@example.com',
    sending: 'Sending …',
  },
} satisfies Record<Locale, unknown>;
type Say = (typeof say)[Locale];
const TIMEOUT_MS = 20_000;

function errorFor(field: Field, t: Say): string {
  const value = field.value.trim();
  if (field.name === 'contactName' && !value) return t.nameMissing;
  if (field.name === 'contactMessage' && value.length < 3) return t.messageMissing;
  if (field.name === 'contactEmail' && value && field.validity.typeMismatch) return t.emailInvalid;
  return '';
}

function describedBy(field: Field, id: string, on: boolean) {
  const ids = new Set((field.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
  if (on) ids.add(id);
  else ids.delete(id);
  if (ids.size) field.setAttribute('aria-describedby', [...ids].join(' '));
  else field.removeAttribute('aria-describedby');
}

function show(field: Field, message: string) {
  const err = document.getElementById(`${field.id}-err`);
  if (!err) return;
  err.textContent = message;
  err.hidden = !message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
  describedBy(field, err.id, !!message);
}

export function mountContactForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-cf-form]');
  const thanks = root.querySelector<HTMLElement>('[data-cf-thanks]');
  const fail = root.querySelector<HTMLElement>('[data-cf-fail]');
  const submit = root.querySelector<HTMLButtonElement>('[data-cf-submit]');
  const label = root.querySelector<HTMLElement>('[data-cf-label]');
  if (!form || !thanks || !fail || !submit || !label) return;
  const t = say[toLocale(root.closest('[lang]')?.getAttribute('lang'))];

  const fields = [...form.querySelectorAll<Field>('.cf-input')];
  const idle = label.textContent ?? '';
  let busy = false;

  form.noValidate = true;

  for (const field of fields) {
    // Once a field has been flagged, re-check it as the visitor types so the error leaves as soon as it is fixed.
    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid')) show(field, errorFor(field, t));
    });
    if (field.name === 'contactEmail') field.addEventListener('blur', () => show(field, errorFor(field, t)));
  }

  const setBusy = (on: boolean) => {
    busy = on;
    label.textContent = on ? t.sending : idle;
    submit.toggleAttribute('aria-disabled', on);
    if (on) form.setAttribute('aria-busy', 'true');
    else form.removeAttribute('aria-busy');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;

    let first: Field | undefined;
    for (const field of fields) {
      const message = errorFor(field, t);
      show(field, message);
      if (message && !first) first = field;
    }
    if (first) {
      first.focus();
      return;
    }

    fail.hidden = true;
    setBusy(true);
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });

    try {
      const res = await fetch(form.dataset.endpoint || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const name = (form.elements.namedItem('contactName') as HTMLInputElement | null)?.value.trim() ?? '';
      const who = thanks.querySelector<HTMLElement>('[data-cf-who]');
      if (who) who.textContent = name ? `, ${name}` : '';
      form.hidden = true;
      thanks.hidden = false;
      thanks.querySelector<HTMLElement>('h2')?.focus();
    } catch {
      fail.hidden = false;
      fail.scrollIntoView({ block: 'nearest' });
    } finally {
      setBusy(false);
    }
  });

  // A second message keeps who you are and clears only what you said.
  root.querySelector('[data-cf-again]')?.addEventListener('click', () => {
    const message = form.elements.namedItem('contactMessage') as HTMLTextAreaElement | null;
    if (message) message.value = '';
    thanks.hidden = true;
    form.hidden = false;
    message?.focus();
  });
}
