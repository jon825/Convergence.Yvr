import React, { useState } from 'react';
import { contact } from '../data/content';
const fields = [
  ['name', 'Full name', 'text', 'name'], ['email', 'Email address', 'email', 'email'],
  ['phone', 'Phone number', 'tel', 'tel'], ['date', 'Event date', 'date'],
  ['address', 'Event address', 'text', 'street-address'], ['guests', 'How many guests?', 'number'],
];
export default function ContactForm() {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!endpoint) {
      const body = [...fields.map(([name, label]) => `${label}: ${data.get(name)}`), '', `About the event: ${data.get('message')}`].join('\n');
      window.open(`mailto:${contact.email}?subject=${encodeURIComponent('Convergence event enquiry')}&body=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
      setStatus('Your email app will open with your enquiry. Please send the email there to contact us.');
      return;
    }
    setSending(true); setStatus('');
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('Thank you. Your enquiry has been submitted.'); form.reset();
    } catch { setStatus(`We couldn’t submit your enquiry. Please try again or email ${contact.email}.`); }
    finally { setSending(false); }
  }
  return <form className="enquiry-form" onSubmit={submit}>
    {fields.map(([name, label, type, autocomplete]) => <label key={name}>{label}<input name={name} type={type} autoComplete={autocomplete} required={name !== 'phone'} min={type === 'number' ? '1' : undefined} maxLength={type === 'text' ? 200 : undefined}/></label>)}
    <label className="form-wide">Tell us about your event<textarea name="message" rows="4" maxLength="5000" required/></label>
    <div className="form-wide"><button className="outline-button" type="submit" disabled={sending}>{sending ? 'SENDING…' : endpoint ? 'SEND ENQUIRY' : 'CREATE EMAIL ENQUIRY'}</button>
      {!endpoint && <p className="form-note">Opens your email app with these details ready to send. You can also email <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>}
      <p role="status" className="form-note">{status}</p></div>
  </form>;
}
