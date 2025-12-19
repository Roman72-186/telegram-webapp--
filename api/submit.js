// api/submit.js  (Vercel Serverless Function)
module.exports = async (req, res) => {
    try {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
      }
      const telegram_id = body.telegram_id ?? null;

      const WEBHOOK_URL = process.env.WATBOT_WEBHOOK_URL;
      if (!WEBHOOK_URL) {
        return res.status(500).json({ error: 'WATBOT_WEBHOOK_URL is missing' });
      }
  
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = null; }
      }
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
  
      const firstName = String(body.firstName || '').trim();
      const lastName  = String(body.lastName  || '').trim();
      const phone     = String(body.phone     || '').trim();
  
      if (!firstName || !lastName) {
        return res.status(400).json({ error: 'firstName and lastName are required' });
      }
      if (!/^\+7\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone format. Expected +7XXXXXXXXXX' });
      }
  
      const payloadToWatbot = {
        firstName,
        lastName,
        phone,
        telegram_id,
        telegram: body.telegram || null,
        source: 'telegram-webapp',
        ts: Date.now(),
      };
      
  
      const r = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToWatbot),
      });
  
      const text = await r.text().catch(() => '');
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch {}
  
      if (!r.ok) {
        return res.status(502).json({
          error: 'Watbot webhook error',
          status: r.status,
          body: json || text || null,
        });
      }
  
      return res.status(200).json({ ok: true, watbot: json || null });
    } catch (e) {
      return res.status(500).json({
        error: 'Unhandled server error',
        message: e && e.message ? e.message : 'unknown',
      });
    }
  };
  