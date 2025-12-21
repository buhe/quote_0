// 只拼装 channel 级和 item 级必填字段，够用即可
export function buildRss(items) {
  const now = new Date().toUTCString();
  const itemXml = items.map(i => `
    <item>
      <title><![CDATA[${i.title}]]></title>
      <link>${i.url}</link>
      <description><![CDATA[${i.extract}]]></description>
      <guid>${i.url}</guid>
      <pubDate>${now}</pubDate>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Random Wikipedia RSS</title>
    <link>https://wikipedia.org</link>
    <description>Auto-generated random Wikipedia entries</description>
    <lastBuildDate>${now}</lastBuildDate>
    ${itemXml}
  </channel>
</rss>`;
}