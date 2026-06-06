import { transformStream } from '../../../lib/copilot/TransformationPipeline';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  const {
    message,
    mode,
    audience,
    client,
    runId,
    history,
    producedArtifacts,
    stream: useStream,
  } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  if (message.length > 10000) {
    return res.status(400).json({ error: 'message exceeds maximum length' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  if (useStream === false) {
    try {
      const { transform } = require('../../../lib/copilot/TransformationPipeline');
      const result = await transform({
        message,
        mode,
        audience,
        client,
        runId,
        history: history || [],
        producedArtifacts: producedArtifacts || [],
      });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({
        error: 'transformation failed',
        detail: err.message || String(err),
      });
    }
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = transformStream({
      message,
      mode,
      audience,
      client,
      runId,
      history: history || [],
      producedArtifacts: producedArtifacts || [],
    });

    for await (const event of stream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);

      if (typeof res.flush === 'function') {
        res.flush();
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    const errorEvent = {
      type: 'error',
      error: err.message || String(err),
    };
    res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
    res.end();
  }
}
