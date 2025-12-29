export const handler = async (event) => {
    try {
        const nowStr = new Date().toISOString()          // 2025-12-20T19:46:09.334Z
            .replace('Z', '+00:00')           // 2025-12-20T19:46:09.334+00:00
            .replace(/(\.\d{3})\d*/, '$100');  // 不足 6 位补 0 → 2025-12-20T19:46:09.334000+00:00

        const url = `https://hypothes.is/api/search?group=3gxjr5RN&sort=created&search_after=${nowStr}&limit=12`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer 6879-bJdzXWQSCno-ONUfjttuoz0ytLffeK3-sSigHJKUfmg'
            }
        };
        console.log(`url: ${url}`)
        const response = await fetch(url, options);
        const data = await response.json();
        const rows = data.rows;
        //   console.log(rows.length);
        const hour = new Date().getHours();

        const nowItem = rows[hour % rows.length];
        const title = nowItem.document.title[0];
        // console.log(`title: ${title}`)
        const exact = nowItem.target[0].selector[2].exact;
        const link = nowItem.links.html;
        const signature = nowItem.created.substring(0, 10);

        const url2 = 'https://dot.mindreset.tech/api/authV2/open/device/48F6EE55B498/text';
        const options2 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dot_app_rNdgyLmXPksJdkFwBrjPqguonlTXIZSJgHRTDjvhjgIagfmlcONIsXpTAxkYESwj'
            },
            body: `{"refreshNow":false,"signature":"Created at ${signature}","title":"${title}","message":"${exact}","link":"${link}"}`
        };

        const response2 = await fetch(url2, options2);
        const data2 = await response2.text();
        // console.log(data);
        const response3 = {
            statusCode: 200,
            body: JSON.stringify(exact),
        };
        return response3;
    } catch (e) {
        console.error(e);
        const response2 = {
            statusCode: 500,
            body: JSON.stringify(e.message),
        };
        return response2;
    }
}