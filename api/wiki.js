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

    const url = 'https://dot.mindreset.tech/api/authV2/open/device/48F6EE55B498/text';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dot_app_rNdgyLmXPksJdkFwBrjPqguonlTXIZSJgHRTDjvhjgIagfmlcONIsXpTAxkYESwj'
      },
      body: `{"refreshNow":true,"title":"${items.title}","message":"${items.extract}","link":"${items.url}"}`
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    return res.status(200).json(data);
    } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
}