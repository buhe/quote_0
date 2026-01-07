export const handler = async (event) => {
  /* ---------- 工具 ---------- */
  // 当天 00:00:00 的 GMT 时间戳（秒）
  const getGMTDayTimestamp = () => {
    const d = new Date();
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
  };

  // 格式化 (MM月DD日)
  const formatDateCN = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `(${m}月${day}日)`;
  };

  // 极简 fetch JSON 包装
  const getJSON = (url, headers) =>
    fetch(url, { headers }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });

  /* ---------- 主流程 ---------- */
  const timestamp = getGMTDayTimestamp();
  const dateStr = formatDateCN();
  console.log('dateStr:', dateStr);

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'content-type': 'application/json'
  }
  try {
    // 1. 拉取 daily 列表
    const listUrl = `https://api.readhub.cn/daily?ts=${timestamp}`;
    const { data: { items } } = await getJSON(listUrl, headers);

    // 2. 顺序拉取详情（Lambda 默认 3 秒计费粒度，串行即可）
    const results = [];
    for (const { uid } of items) {
      const detailUrl = `https://api.readhub.cn/topic/detail?uid=${uid}`;
      const { data: { items: [blog] } } = await getJSON(detailUrl, headers);
      results.push({
        title: blog.title,
        summary: blog.summary.replace('... ', ''),
        link: blog.newsAggList[0].url,
        signature: blog.siteNameDisplay,
      });
    }

    const hour = new Date().getHours();

    const nowItem = results[hour % results.length];
    const url2 = 'https://dot.mindreset.tech/api/authV2/open/device/48F6EE55B498/text';
    const options2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer dot_app_rNdgyLmXPksJdkFwBrjPqguonlTXIZSJgHRTDjvhjgIagfmlcONIsXpTAxkYESwj'
        },
        body: `{"refreshNow":false,"signature":"From ${nowItem.signature}","taskKey":"P5o7BW9jgYrs","title":"${nowItem.title}","message":"${nowItem.summary}","link":"${nowItem.link}"}`
    };

    const response2 = await fetch(url2, options2);
    const data2 = await response2.text();
    // 3. 返回给调用方（也可改存 S3 / 发 SNS / 推 DynamoDB 等）
    return {
      statusCode: 200,
      body: JSON.stringify({ dateStr, news: results.length }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};