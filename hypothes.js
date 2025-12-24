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

        const url2 = 'https://dot.mindreset.tech/api/authV2/open/device/48F6EE55B498/text';
        const options2 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer dot_app_rNdgyLmXPksJdkFwBrjPqguonlTXIZSJgHRTDjvhjgIagfmlcONIsXpTAxkYESwj'
            },
            body: `{"refreshNow":false,"icon":"iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAtFBMVEXSKDj////PAAD+/f3dhIjSMj/TNkLSLjzOAAD89/fRACPVU1vSKTjmrK7TNEHSLz3SJTb89vbTOUX03d7TPkjVTVbRByfMAADmrrD89PX78fLehYnVRE7SIzTSHDHRGC7++vvx0tPptLb57O324OHYZWvWVV3QABH9+Pjvy83txcfVSVLRESvswcLkpKbjn6Lil5rfjpHcen/bc3jaa3HXXGP46Onz19nnr7HWT1jRBCbQABm6Pzr0AAACPUlEQVRYw+2W6W6jMBRG8XXADiGGELckhC37viddZt7/vcaQhnSqUeOANX/KsZAsCx19tnWtq1VUVFRU/Fcci9zBch7xERaZd4gYkY9nx+BOGt8ycSG2ZUPaK3fh1+/gL9yVLeezCPSRBH0gllzA6QkjfE8nfjlN5SLq0ENS9ECXFNY+QqR8I6w9IsxRKVxvOs3BTKHw6IEXdxUKe1PuTFoKhTUwnp9+oLCLcIbyhFhdwtai+bZ4EUoVwl9LPGpQSmG1qyOsQPh73I+BM6YT75AgXFrI4mWwCiyXaSTwBgqEuhVrJp3SqR66ME5QeaGTbno0P4FOwuhFgZA8P/li5r+bBoERwmWFtkEHKMEYbamrQ1uB0E5jifFGDSVCFrJhViXNmxALSlTKspsJO7kwk+GStXwTipH058Mytfw1oX+kEM0RLp0wu2XBzuMcoiHCBR+H25btLGG9EdoWh3khYQ/c+P0q5EYmTM4mtzntF0tIQwguZ9j0wpi209naMyPvmBQS7t3zcnxJOLDOE/dSeuvxZOcXu5SZaANnKCOpCzDKwDPxKextcIHSU97OHRC+33BidJAUkogNEb6Ry78sDllENCkY1Lr/Ora/U3drwDRJdGhsm1c6m/b1iWlvOvnytiE2LItjmDQHvMC/vFt+4AHNMQ1Hk4cZOYzT3setUv55XXsMK0dz6SC91AF1P6+WwCbwitArEFtTgzjSoNUK0kNTgxVyut9THlqaKqPDAJgjfOqMui58FRUVFYX5Az4bNPF95dvAAAAAAElFTkSuQmCC","taskKey":"gFQrtWcXHIOk","title":"${title}","message":"${exact}","link":"${link}"}`
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