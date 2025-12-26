    // today = datetime.date.today()

    // # 生成当天0时的时间
    // zero_today = datetime.datetime.combine(today, datetime.time.min)

    // # 转换为GMT时间
    // gmt_timezone = pytz.timezone('GMT')
    // zero_today_gmt = gmt_timezone.localize(zero_today)

    // # 将GMT时间转换为Unix时间戳
    // timestamp = int(zero_today_gmt.timestamp())

    // # 获取当前时间的日期部分
    // today = datetime.date.today()

    // # 将日期格式化为字符串
    // date_str = today.strftime('(%m月%d日)')

    // url = 'https://api.readhub.cn/daily?ts=' + str(timestamp)
    // headers = {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //     'content-type': 'application/json',
    //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4bVdlbDc1QVZUVyIsInVzZXJfaWQiOjEyNDY1MjEsIm5pY2tfbmFtZSI6InVfOG1XZWw3NUFWVFciLCJhdmF0YXIiOiJodHRwczovL3JlYWRodWItb3NzLm5vY29kZS5jb20vc3RhdGljL3VzZXIucG5nIiwibmlja25hbWUiOiJ1XzhtV2VsNzVBVlRXIiwidW5pb25JZCI6Im9vNG5Fd1hPZXp6X2twM1FOZlBCekZib0tRczQiLCJpc0JldGEiOmZhbHNlLCJzdXBlck1hbmFnZXIiOmZhbHNlLCJpYXQiOjE2Nzc5MDk1MzYsImV4cCI6MTY5MDg2OTUzNn0.t0vQYiH6BQLxNN_CjBe3A04n6zwUqDwHN4etbwm8NAQ'
    // }

    // response = requests.get(url, headers=headers)
    // # print(response.text)
    // data = response.json()
    // items = data['data']['items']
    // for item in items:
    //     uid = item['uid']
    //     # print(uid)
    //     url_detail = 'https://api.readhub.cn/topic/detail?uid=' + uid
    //     response = requests.get(url_detail, headers=headers)
    //     # print(response.text)
    //     blog = response.json()['data']['items'][0]
    //     # print(blog)
    //     rawTitle = blog['title']
    //      rawSummary = blog['summary'].replace('... ', '')

export const handler = async () => {
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
        body: `{"refreshNow":false,"taskKey":"w172i06pcMfd","title":"${nowItem.title}","message":"${nowItem.summary}","link":"${nowItem.link}","icon":"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"}`
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