// 只拼装 channel 级和 item 级必填字段，够用即可
export function buildRss(items) {
  const now = new Date().toUTCString();
  const itemXml = `
    <item>
      <title><![CDATA[${items.title}]]></title>
      <link>${items.url}</link>
      <description><![CDATA[${items.extract}]]></description>
      <guid>${items.url}</guid>
      <pubDate>${now}</pubDate>
    </item>`;

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