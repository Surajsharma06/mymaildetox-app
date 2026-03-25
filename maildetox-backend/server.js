const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://maildetox.tech9logia.com',
    'https://mymaildetox-app.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  '56971612439-kcaeaav7g9qp9ljnl58apdriaq167mpi.apps.googleusercontent.com',
  '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',
  process.env.REDIRECT_URI || 'http://localhost:5000/auth/callback'
);

const IMPORTANT_DOMAINS = [
  'google.com','gmail.com','apple.com','microsoft.com','outlook.com',
  'yahoo.com','icloud.com','protonmail.com','gov.in','gov.ca','nic.in',
  'hdfc.com','hdfcbank.com','icicibank.com','sbi.co.in','axisbank.com',
  'kotak.com','rbi.org.in','incometax.gov.in',
  'td.com','rbc.com','scotiabank.com','bmo.com','cibc.com',
  'irctc.co.in','railway.gov.in','amityonline.com','amity.edu',
];

const IMPORTANT_KEYWORDS = [
  'otp','password','reset','verify','verification','invoice','receipt',
  'payment','transaction','booking','ticket','pnr','offer letter',
  'appointment','visa','passport','aadhaar','pan','salary','payslip',
  'statement','bank','credit card','loan','insurance','policy','tax',
  'itr','admit card','result','marksheet','certificate','degree',
];

const PROMO_KEYWORDS = [
  'sale','offer','deal','discount','% off','cashback','coupon','promo',
  'flash sale','limited time','exclusive','save','shop now','buy now',
  'free shipping','checkout','order now',
];

const SPAM_KEYWORDS = [
  'congratulations','winner','won','prize','lottery','claim now',
  'urgent','guaranteed','make money','earn from home',
];

function classifyEmail(subject, senderEmail, hasUnsub) {
  const sub = (subject || '').toLowerCase();
  const email = (senderEmail || '').toLowerCase();
  if (IMPORTANT_KEYWORDS.some(k => sub.includes(k))) return 'IMPORTANT';
  if (IMPORTANT_DOMAINS.some(d => email.includes(d))) return 'IMPORTANT';
  if (SPAM_KEYWORDS.some(k => sub.includes(k))) return 'SPAM';
  if (PROMO_KEYWORDS.some(k => sub.includes(k))) return 'PROMO';
  if (hasUnsub) return 'NEWSLETTER';
  return 'IMPORTANT';
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 60)  return mins + ' min ago';
    if (hours < 24)  return hours + ' hours ago';
    if (days  < 7)   return days + ' days ago';
    if (days  < 30)  return Math.floor(days/7) + ' weeks ago';
    if (days  < 365) return Math.floor(days/30) + ' months ago';
    return Math.floor(days/365) + ' years ago';
  } catch { return 'Unknown'; }
}

function extractEmail(fromStr) {
  if (!fromStr) return { email: '', name: '' };
  const match = fromStr.match(/<([^>]+)>/);
  const email = match ? match[1].trim() : fromStr.trim();
  const name  = fromStr.replace(/<[^>]+>/, '').replace(/"/g, '').trim() || email.split('@')[0];
  return { email: email.toLowerCase(), name };
}

function extractUnsubUrl(headerVal, bodySnippet) {
  if (headerVal) {
    const urlMatch = headerVal.match(/https?:\/\/[^>\s,]+/);
    if (urlMatch) return urlMatch[0];
  }
  if (bodySnippet) {
    const bodyMatch = bodySnippet.match(/https?:\/\/[^\s"'<>]+(?:unsub|unsubscribe|optout|opt-out)[^\s"'<>]*/i);
    if (bodyMatch) return bodyMatch[0];
  }
  return null;
}

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth URL
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
  res.json({ url });
});

// OAuth Callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const redirectBase = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(redirectBase + '?token=' + tokens.access_token + '&refresh=' + (tokens.refresh_token || ''));
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(500).json({ error: 'Auth failed' });
  }
});

// User Info
app.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    oauth2Client.setCredentials({ access_token: token });
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    res.json({ email: data.email, name: data.name, picture: data.picture });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Subscriptions
app.get('/subscriptions', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    oauth2Client.setCredentials({ access_token: token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    console.log('Fetching messages...');
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 200,
      q: 'in:inbox -is:important (unsubscribe OR newsletter OR "opt out" OR promotional OR noreply)',
    });

    const messages = listRes.data.messages || [];
    console.log('Found ' + messages.length + ' messages');

    const senderMap = {};
    const BATCH = 10;

    for (let i = 0; i < Math.min(messages.length, 150); i += BATCH) {
      const batch = messages.slice(i, i + BATCH);
      await Promise.all(batch.map(async (msg) => {
        try {
          const detail = await gmail.users.messages.get({
            userId: 'me', id: msg.id, format: 'metadata',
            metadataHeaders: ['From', 'Subject', 'List-Unsubscribe', 'Date'],
          });
          const headers = detail.data.payload?.headers || [];
          const getH = name => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
          const fromRaw = getH('From');
          const subject = getH('Subject');
          const unsubH  = getH('List-Unsubscribe');
          const dateStr = getH('Date');
          const snippet = detail.data.snippet || '';
          const { email, name } = extractEmail(fromRaw);
          if (!email) return;
          const unsubUrl = extractUnsubUrl(unsubH, snippet);
          const category = classifyEmail(subject, email, !!unsubUrl);
          if (category === 'IMPORTANT') return;
          if (!senderMap[email]) {
            senderMap[email] = {
              id: email, sender: name, email, count: 0,
              category, unsubUrl,
              last: formatDate(dateStr),
              lastRaw: new Date(dateStr).getTime() || 0,
              messageIds: [],
            };
          }
          senderMap[email].count++;
          senderMap[email].messageIds.push(msg.id);
          if (!senderMap[email].unsubUrl && unsubUrl) senderMap[email].unsubUrl = unsubUrl;
          const ts = new Date(dateStr).getTime() || 0;
          if (ts > senderMap[email].lastRaw) {
            senderMap[email].last = formatDate(dateStr);
            senderMap[email].lastRaw = ts;
          }
        } catch {}
      }));
    }

    const subscriptions = Object.values(senderMap)
      .sort((a, b) => b.count - a.count)
      .map(({ lastRaw, ...rest }) => rest);

    console.log('Returning ' + subscriptions.length + ' subscriptions');
    res.json({ subscriptions, total: subscriptions.length });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// UNSUBSCRIBE — Click unsub link + move to SPAM (future emails blocked)
app.post('/unsubscribe', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { unsubUrl, messageIds } = req.body;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    // Click unsubscribe link
    if (unsubUrl && unsubUrl.startsWith('http')) {
      const lib = unsubUrl.startsWith('https') ? require('https') : require('http');
      await new Promise(resolve => {
        lib.get(unsubUrl, { timeout: 8000 }, r => resolve(r)).on('error', resolve);
      });
      console.log('Unsubscribe URL clicked:', unsubUrl);
    }

    // Move to SPAM — blocks future emails from this sender
    oauth2Client.setCredentials({ access_token: token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const ids = (messageIds || []).slice(0, 50);
    await Promise.all(ids.map(async (id) => {
      try {
        await gmail.users.messages.modify({
          userId: 'me', id,
          requestBody: {
            removeLabelIds: ['INBOX'],
            addLabelIds: ['SPAM'],
          },
        });
      } catch {}
    }));

    console.log('Unsubscribed + moved to SPAM:', ids.length, 'emails');
    res.json({ success: true, message: 'Unsubscribed! Future emails blocked.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PERMANENT DELETE — Seedha delete, trash mein bhi nahi jaata
app.post('/delete', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { messageIds } = req.body;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    oauth2Client.setCredentials({ access_token: token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const ids = (messageIds || []).slice(0, 50);

    await Promise.all(ids.map(async (id) => {
      try {
        // messages.delete = permanent delete, bypasses trash
        await gmail.users.messages.delete({ userId: 'me', id });
      } catch {}
    }));

    console.log('Permanently deleted:', ids.length, 'emails');
    res.json({ success: true, deleted: ids.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('MailDetox Backend running on port ' + PORT);
});
