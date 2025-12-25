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
        body: `{"refreshNow":false,"taskKey":"gFQrtWcXHIOk","title":"${nowItem.title}","message":"${nowItem.summary}","link":"${nowItem.link}"}`
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