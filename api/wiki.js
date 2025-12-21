import fs from 'fs';
import path from 'path';
import { buildRss } from '../lib/builder.js';

// Vercel 的 Serverless Function 默认超时 10s，足够
export default async function handler(req, res) {
  try {
    // 1. 拉 5 条随机摘要
    const items = await Promise.all(
      Array.from({ length: 5 }).map(() =>
        fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
          .then(r => r.json())
          .then(({ title, extract, content_urls }) => ({
            title,
            extract,
            url: content_urls.desktop.page
          }))
      )
    );

    // 2. 拼 RSS
    const xml = buildRss(items);

    // 3. 写文件（Vercel 的 /public 会被静态托管）
    const out = path.join(process.cwd(), 'public', 'rss.xml');
    fs.writeFileSync(out, xml, 'utf8');

    res.status(200).json({ ok: true, items: items.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}