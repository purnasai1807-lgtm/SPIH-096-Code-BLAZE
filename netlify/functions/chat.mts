import OpenAI from 'openai';

const openai = new OpenAI();

const SYSTEM_PROMPT =
  'You are the DelayGuard Assistant, a helpful AI assistant built into DelayGuard, a platform that helps ' +
  'government agencies track service requests and predict SLA breaches before they happen. Answer questions ' +
  'clearly and concisely. You do not have live access to a specific request record, so if asked about a ' +
  'specific case, point the user to the Requests or Analytics pages, and otherwise help with general ' +
  'questions about SLA risk, prioritization, and using the app.';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string' &&
    candidate.content.trim().length > 0
  );
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const history = rawMessages.filter(isChatMessage).slice(-20);

  if (history.length === 0) {
    return Response.json({ error: 'At least one message is required' }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 600,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "Sorry, I didn't catch that — could you rephrase?";
    return Response.json({ reply });
  } catch (error) {
    console.error('chat function error:', error);
    return Response.json({ error: 'The assistant is unavailable right now. Please try again shortly.' }, { status: 502 });
  }
};

export const config = {
  path: '/api/chat',
};
