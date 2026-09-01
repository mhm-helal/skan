export default async function handler(req, res) {
  const BACKEND = process.env.BACKEND_URL;
  if (!BACKEND) {
    return res.status(500).json({ detail: 'BACKEND_URL not configured' });
  }

  const path = req.url;

  const fwdHeaders = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!['host', 'x-vercel-id', 'x-forwarded-for', 'x-real-ip', 'connection'].includes(k)) {
      fwdHeaders[k] = v;
    }
  }

  try {
    let body = undefined;
    if (!['GET', 'HEAD'].includes(req.method)) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = Buffer.concat(chunks);
    }

    const backendRes = await fetch(`${BACKEND}${path}`, {
      method: req.method,
      headers: fwdHeaders,
      body,
      redirect: 'follow',
    });

    res.status(backendRes.status);
    backendRes.headers.forEach((v, k) => {
      if (!['transfer-encoding', 'connection', 'content-encoding'].includes(k)) {
        res.setHeader(k, v);
      }
    });

    const buf = await backendRes.arrayBuffer();
    res.send(Buffer.from(buf));
  } catch (err) {
    res.status(502).json({ detail: 'Backend unavailable', error: err.message });
  }
}

export const config = {
  api: { bodyParser: false, responseLimit: false },
};
