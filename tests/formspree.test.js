import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formspreeEndpoint, sendEnquiry } from '../src/services/formspree.js';

const endpoint = 'https://formspree.io/f/testform';
const details = {
  name: '  Test Guest  ',
  email: 'guest@example.test',
  phone: '6045550100',
  date: '2027-03-15',
  occasion: 'Birthday celebration',
  guests: '12',
  service: 'Buffet Style/Family Style',
  message: '  A private dinner with food and drink pairings.  ',
};

test('only public HTTPS Formspree form endpoints can receive an enquiry', () => {
  assert.equal(formspreeEndpoint(` ${endpoint} `), endpoint);
  assert.equal(formspreeEndpoint(`${endpoint}/`), `${endpoint}/`);
  for (const invalid of [undefined, '', 'your-form-id', 'http://formspree.io/f/testform',
    'https://formspree.io/', 'https://formspree.io/forms/testform',
    'https://formspree.io.example.test/f/testform', 'https://example.test/f/testform',
    'https://guest:password@formspree.io/f/testform', `${endpoint}?recipient=other@example.test`, `${endpoint}#extra`]) {
    assert.equal(formspreeEndpoint(invalid), '', `Unexpected endpoint accepted: ${invalid}`);
  }
});

test('a successful submission includes every enquiry field, subject and cancellation signal', async context => {
  const controller = new AbortController();
  let calls = 0;
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    calls++;
    assert.equal(url, endpoint);
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Accept, 'application/json');
    assert.equal(options.signal, controller.signal);
    assert.deepEqual(Object.fromEntries(options.body), {
      ...Object.fromEntries(Object.entries(details).map(([key, value]) => [key, value.trim()])),
      _subject: 'New Convergence event enquiry',
    });
    return Response.json({ ok: true });
  });
  await sendEnquiry(endpoint, enquiryData(), controller.signal);
  assert.equal(calls, 1);
});

test('unconfigured or incorrect endpoints never send enquiry details', async context => {
  const fetch = context.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected request'); });
  for (const invalid of ['', 'https://example.test/f/testform']) {
    await assert.rejects(sendEnquiry(invalid, enquiryData()), /endpoint is required/);
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test('failed, ambiguous and non-JSON responses are never treated as success', async context => {
  const responses = [
    Response.json({ ok: true }, { status: 500 }),
    Response.json({ ok: false }),
    Response.json({}),
    Response.json({ message: 'Received' }),
    Response.json({ ok: true, errors: [{ message: 'Rejected' }] }),
    new Response('<html>Unexpected response</html>', { headers: { 'Content-Type': 'text/html' } }),
  ];
  context.mock.method(globalThis, 'fetch', async () => responses.shift());
  const count = responses.length;
  for (let i = 0; i < count; i++) {
    await assert.rejects(sendEnquiry(endpoint, enquiryData()), /not accepted/);
  }
});

test('network failures propagate for the form to preserve details and offer retry', async context => {
  const failure = new TypeError('Network unavailable');
  context.mock.method(globalThis, 'fetch', async () => { throw failure; });
  await assert.rejects(sendEnquiry(endpoint, enquiryData()), error => error === failure);
});

test('an interrupted submission passes its aborted signal to delivery', async context => {
  const controller = new AbortController();
  controller.abort();
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    options.signal.throwIfAborted();
    throw new Error('An aborted request must not continue');
  });
  await assert.rejects(sendEnquiry(endpoint, enquiryData(), controller.signal), { name: 'AbortError' });
});

function enquiryData() {
  const data = new FormData();
  for (const [name, value] of Object.entries(details)) data.set(name, value);
  return data;
}
