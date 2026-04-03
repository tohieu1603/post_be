import { Router, Request, Response } from 'express';
import axios from 'axios';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_API_URL = process.env.AI_API_URL || 'https://ark.ap-southeast.bytepluses.com/api/coding/v3';
const AI_MODEL = process.env.AI_MODEL || 'kimi-k2.5';

const SYSTEM_PROMPT = `Bạn là trợ lý AI của AI Vietnam — một trang tin điện tử chuyên sâu về trí tuệ nhân tạo, công nghệ và phát triển bền vững tại Việt Nam.

Vai trò của bạn:
- Giúp người dùng tìm hiểu về tin tức AI, công nghệ
- Tóm tắt và giải thích các bài viết trên trang
- Trả lời câu hỏi về AI, machine learning, deep learning, LLM
- Đưa ra nhận định về xu hướng công nghệ tại Việt Nam và thế giới

Quy tắc:
- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu
- Chỉ trả lời các chủ đề liên quan đến tin tức, công nghệ, AI
- Từ chối lịch sự nếu được hỏi về chủ đề không liên quan (chính trị, tôn giáo, nội dung nhạy cảm)
- Trích dẫn nguồn nếu có thể`;

/**
 * POST /api/chat
 * Stream chat completion using BytePlus AI (OpenAI-compatible)
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, error: 'messages array is required' });
  }

  if (!AI_API_KEY) {
    return res.status(500).json({ success: false, error: 'AI service not configured' });
  }

  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role === 'ai' ? 'assistant' : m.role,
      content: m.content,
    })),
  ];

  // SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let aborted = false;
  res.on('close', () => { aborted = true; });

  try {
    console.log('[Chat] Calling AI API...');
    const response = await axios.post(
      `${AI_API_URL}/chat/completions`,
      {
        model: AI_MODEL,
        messages: chatMessages,
        stream: true,
        max_tokens: 2048,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        responseType: 'stream',
        timeout: 90000,
      }
    );

    console.log('[Chat] AI API responded, status:', response.status);
    let buffer = '';

    response.data.on('data', (chunk: Buffer) => {
      if (aborted) return;
      const raw = chunk.toString('utf-8');
      console.log('[CHUNK]', raw.substring(0, 80));
      buffer += raw;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch {}
      }
    });

    response.data.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });

    response.data.on('error', (err: Error) => {
      if (!aborted) {
        res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    });
  } catch (err: any) {
    console.error('[Chat Error]', err?.message);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Chat failed' });
    }
    res.write(`data: ${JSON.stringify({ error: 'AI service unavailable' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

export default router;
