export const handler = async (event) => {
  try {
    // // 1. 拉 1 条随机摘要
    const items = await fetch('https://zh.wikipedia.org/api/rest_v1/page/random/summary');
    const data1 = await items.json();
    const url = 'https://dot.mindreset.tech/api/authV2/open/device/48F6EE55B498/text';
    const extract = data1.extract.replace(/\n/g, '');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dot_app_rNdgyLmXPksJdkFwBrjPqguonlTXIZSJgHRTDjvhjgIagfmlcONIsXpTAxkYESwj'
      },
      body: `{"refreshNow":true,"title":"${data1.title}","message":"${extract}","link":"${data1.content_urls.desktop.page}"}`
    };

      const response = await fetch(url, options);
      const data = await response.text();
      // console.log(data);
      const response2 = {
        statusCode: 200,
        body: JSON.stringify(extract),
      };
      return response2;
  } catch (e) {
    console.error(e);
     const response2 = {
        statusCode: 500,
        body: JSON.stringify(e.message),
      };
      return response2;
  }
}