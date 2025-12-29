export const handler = async (event) => {
  try {
    const key   = 'dot_app_rNdgyLmXPksJdkFwBrjPqguonlTXIZSJgHRTDjvhjgIagfmlcONIsXpTAxkYESwj';
    const title = 'Crypto Prices';
    const taskKey = '28GqT6T5kEDV';
    const prices = await Promise.all(
      ['BTCUSDT','ETHUSDT','USDCUSDT'].map(async s => {
        const t = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${s}`).then(r => r.json());
        const name = s.replace('USDT','');
        return `${name} $${Number(t.lastPrice).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} ${t.priceChangePercent>=0?' up ':' down '}${Number(t.priceChangePercent).toFixed(1)}%`;
      })
    );

    const body = JSON.stringify({
      refreshNow: false,
      taskKey,
      title,
      message: prices.join('\n'),
      signature: `Updated at ${new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}`
    });

    const res = await fetch('https://dot.mindreset.tech/api/authV2/open/device/48F6EE55B498/text', {
      method : 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type' : 'application/json'
      },
      body
    });

    if (!res.ok) throw new Error(`Dot API ${res.status}`);

    const response3 = {
      statusCode: 200,
      body: JSON.stringify('Prices pushed to Dot device')
    };
    return response3;
  } catch (e) {
    console.error(e);
    const response2 = {
      statusCode: 500,
      body: JSON.stringify(e.message)
    };
    return response2;
  }
};