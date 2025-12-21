import fs from 'fs';
import path from 'path';
import { buildRss } from '../lib/builder.js';

// Vercel 的 Serverless Function 默认超时 10s，足够
export default async function handler(req, res) {
  try {
    // 1. 拉 1 条随机摘要
    const items = await fetch('https://zh.wikipedia.org/api/rest_v1/page/random/summary')
          .then(r => r.json())
          .then(({ title, extract, content_urls }) => ({
            title,
            extract,
            url: content_urls.desktop.page
          }))

    // 2. 拼 RSS
    const xml = buildRss(items);

    // 3
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    // 可选：让阅读器/缓存知道多久更新一次
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).send(xml); 
    } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}