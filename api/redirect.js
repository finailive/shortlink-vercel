export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');

  try {
    const r = await fetch(`https://script.google.com/macros/s/AKfycbxLWccLvVZCugQ1kgDQcos0A7jRVu8EhOv5rpCVWBsXzJJbtf6ukkXPdCu8hVQSy1bz/exec?code=${encodeURIComponent(code)}`);
    const html = await r.text();

    // ✅ Cập nhật regex để linh hoạt hơn: cho phép ' hoặc " và có thể có khoảng trắng
    const match = html.match(/window\.location\.replace\((["'])(.*?)\1\)/);

    if (match && match[2]) {
      res.writeHead(302, { Location: match[2] });
      res.end();
    } else {
      res.status(500).send('❌ Target URL not found');
    }
  } catch (e) {
    res.status(500).send('❌ Proxy error: ' + e.message);
  }
}
