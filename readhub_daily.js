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
