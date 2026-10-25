export function formspreeEndpoint(value) {
  try {
    const endpoint = new URL(value?.trim());
    if (endpoint.protocol !== 'https:' || endpoint.host !== 'formspree.io'
      || !/^\/f\/[a-zA-Z0-9]+\/?$/.test(endpoint.pathname)
      || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) return '';
    return endpoint.href;
  } catch {
    return '';
  }
}

export async function sendEnquiry(endpoint, data, signal) {
  const target = formspreeEndpoint(endpoint);
  if (!target) throw new Error('A Formspree form endpoint is required');

  // The website supplies enquiry details; Formspree controls the recipient.
  for (const [name, value] of data) {
    if (typeof value === 'string') data.set(name, value.trim());
  }
  data.set('_subject', 'New Convergence event enquiry');

  const response = await fetch(target, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json' },
    signal,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true || result.errors?.length) {
    throw new Error('The enquiry was not accepted');
  }
}
