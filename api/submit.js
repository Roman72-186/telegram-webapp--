// api/submit.js (Vercel Serverless Function)
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Используем новый вебхук WatBot
    const WEBHOOK_URL = 'https://api.watbot.ru/hook/4325587:oAbD2q949K3SGmOKvZXF2gjtO4d1LHrTnHNWX4T2h8dB6DO8';

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = null; }
    }
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    // Получаем userData из body.telegram.user
    const userData = body.telegram?.user || body.max?.user || body.user || {};
    const max_user_id =
      body.max_user_id ??
      userData.user_id ??
      userData.id ??
      body.telegram_id ??
      null;

    const telegram_id = max_user_id ?? body.telegram_id ?? null;

    const firstName = String(userData.first_name || body.firstName || '').trim();
    const lastName  = String(userData.last_name || body.lastName || '').trim();
    const phone     = String(userData.phone_number || body.phone || '').trim();

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'firstName and lastName are required' });
    }
    if (!/^\+7\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone format. Expected +7XXXXXXXXXX' });
    }

    // Подготовка данных в формате, требуемом WatBot
    // Используем telegram_id как основной параметр поиска, если доступен
    const payloadToWatBot = {
      contact_by: max_user_id ? 'telegram_id' : 'phone',
      search: max_user_id ? String(max_user_id) : phone,
      variables: {
        // Основная информация о пользователе
        customer_name: `${firstName} ${lastName}`,
        customer_phone: phone,
        
        // Информация из Telegram
        telegram_id: max_user_id,
        max_user_id: max_user_id,
        
        // Все данные пользователя как один JSON-объект
        max_user_data: JSON.stringify(userData || null),
        
        // Дополнительная информация
        source: 'telegram-webapp-registration',
        ts: new Date().toISOString(),
        
        // Поля для возможного расширения функционала
        registration_date: new Date().toISOString().split('T')[0],
        registration_source: 'telegram_mini_app'
      }
    };

    const r = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadToWatBot),
    });

    const text = await r.text().catch(() => '');
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch {}

    if (!r.ok) {
      return res.status(502).json({
        error: 'WatBot webhook error',
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
