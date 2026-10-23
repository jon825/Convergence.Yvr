import React, { useRef, useState } from 'react';
import { contact } from '../data/content';

const fields = [
  ['name', 'Full name', 'text', 'name'],
  ['email', 'Email address', 'email', 'email'],
  ['phone', 'Phone number', 'tel', 'tel'],
  ['date', 'Event date', 'date'],
  ['occasion', 'Occasion', 'text'],
  ['guests', 'How many guests?', 'number'],
];
const services = ['Canapés', 'Plated Dinner', 'Buffet Style/Family Style'];
const requiredMessages = {
  name: 'Please enter your full name.',
  email: 'Please enter your email address.',
  phone: 'Please enter your phone number.',
  date: 'Please choose an event date.',
  occasion: 'Please tell us the occasion.',
  guests: 'Please enter the number of guests.',
  service: 'Please select a type of service.',
  message: 'Please tell us about your event.',
};

function fieldError(field) {
  if (!field.value.trim()) return requiredMessages[field.name];
  if (field.name === 'email' && field.validity.typeMismatch) return 'Please enter a valid email address.';
  if (field.name === 'guests' && (!Number.isInteger(Number(field.value)) || Number(field.value) < 1)) return 'Please enter a whole number of guests, at least 1.';
  if (field.name === 'service' && !services.includes(field.value)) return requiredMessages.service;
  if (!field.validity.valid) return 'Please check this field and try again.';
  return '';
}

export default function ContactForm() {
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState({ kind: 'idle', message: '' });
  const submitting = useRef(false);
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim();
  const sending = status.kind === 'sending';

  function updateField(event) {
    const field = event.target;
    if (!requiredMessages[field.name]) return;
    if (status.kind !== 'sending') setStatus({ kind: 'idle', message: '' });
    if (!attempted) return;
    const message = fieldError(field);
    setErrors(current => {
      const next = { ...current };
      if (message) next[field.name] = message;
      else delete next[field.name];
      return next;
    });
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const controls = [...form.elements].filter(field => requiredMessages[field.name]);
    const nextErrors = Object.fromEntries(controls.map(field => [field.name, fieldError(field)]).filter(([, message]) => message));
    setAttempted(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({ kind: 'validation', message: 'Please complete the highlighted fields before sending your enquiry.' });
      window.requestAnimationFrame(() => controls.find(field => nextErrors[field.name])?.focus());
      return;
    }
    if (!endpoint) {
      setStatus({ kind: 'error', message: 'Online enquiries are temporarily unavailable. Please contact us by email using the link below.' });
      return;
    }

    // Snapshot the validated details before disabling fields during delivery.
    const data = new FormData(form);
    for (const [name, value] of data) if (typeof value === 'string') data.set(name, value.trim());
    data.set('_subject', 'New Convergence event enquiry');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    submitting.current = true;
    setStatus({ kind: 'sending', message: 'Sending your enquiry…' });
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true || result.errors?.length) throw new Error('Submission was not accepted');
      form.reset();
      setErrors({});
      setAttempted(false);
      setStatus({ kind: 'success', message: 'Thank you—your enquiry has been sent. We’ll get back to you by email.' });
    } catch {
      setStatus({ kind: 'error', message: 'We couldn’t confirm your enquiry was sent. Your details have been kept. Please try again, or contact us by email below.' });
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
    }
  }

  const errorAttributes = name => ({
    id: `enquiry-${name}`,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `enquiry-${name}-error` : undefined,
  });
  const errorMessage = name => errors[name] && <span className="field-error" id={`enquiry-${name}-error`}>{errors[name]}</span>;

  return <form className="enquiry-form" noValidate onSubmit={submit} onChange={updateField} aria-busy={sending}>
    <p className="form-required-note form-wide">All fields are required.</p>
    {fields.map(([name, label, type, autocomplete]) => <div className="form-field" key={name}>
      <label htmlFor={`enquiry-${name}`}>{label}</label>
      <input {...errorAttributes(name)} name={name} type={type} autoComplete={autocomplete} required disabled={sending} min={type === 'number' ? '1' : undefined} step={type === 'number' ? '1' : undefined} maxLength={type === 'text' ? 200 : undefined}/>
      {errorMessage(name)}
    </div>)}
    <div className="form-field form-wide">
      <label htmlFor="enquiry-service">Type of Service</label>
      <select {...errorAttributes('service')} name="service" defaultValue="" required disabled={sending}>
        <option value="" disabled>Select a service</option>
        {services.map(service => <option key={service} value={service}>{service}</option>)}
      </select>
      {errorMessage('service')}
    </div>
    <div className="form-field form-wide">
      <label htmlFor="enquiry-message">Tell us about your event!</label>
      <textarea {...errorAttributes('message')} name="message" rows="4" maxLength="5000" required disabled={sending}/>
      {errorMessage('message')}
    </div>
    <div className="form-wide">
      <button className="outline-button" type="submit" disabled={sending}>{sending ? 'SENDING…' : 'SEND ENQUIRY'}</button>
      <div className={`form-feedback ${status.kind}`} role="status" aria-live="polite" aria-atomic="true">{status.message}</div>
      <p className="form-note">Prefer email? <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
    </div>
  </form>;
}
