
export const handler = async (event) => {
  try {
    // // 1. 拉 1 条随机摘要
    const items = await fetch('https://zh.wikipedia.org/api/rest_v1/page/random/summary');
    // const items = await fetch('https://zh.wikipedia.org/api/rest_v1/page/summary/Linux%E6%B8%B8%E6%88%8F');
    const data1 = await items.json();
    const url = 'https://dot.mindreset.tech/api/authV2/open/device/48F6EE55B498/text';
    const extract = data1.extract.replace(/\n/g, '');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dot_app_rNdgyLmXPksJdkFwBrjPqguonlTXIZSJgHRTDjvhjgIagfmlcONIsXpTAxkYESwj'
      },
      // body: `{"refreshNow":true,"title":"1","message":"3","link":"4"}`
      body: `{"refreshNow":false,"icon":"iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEaklEQVR4nO1Ya2hcRRSeNPWBWpWsyd35vrlZjAtqFERWFBEf/RGxYEFQ/GHBSktRwYqioKBSX6iV+kClCKKIICJKa6mCzxZFBZWKSJUWrfVZH7XGttGmNbFy6lk6DrP33iS7Dcj9YGG593xzvzNn5sw5Y0yJEiVKlChRYhpBcgzAbwB+ALCJ5Mck3wTwAsnXAXwE4EsA34kdyb+EB+A2ktsBbAHwBcn3Sb4E4FWS63Ssn0nuJLlIObtJ/qrvxOYVAC8D+ECfbQUwqrrOIDki45PcQPIdkitJvktyI8mfAOwyaZqeBmA+yVUk/ya5t8VP3s+x1jbkA/39/VZ4ANZncJY758611h4jHGvtEIAHAQxHbLcCuJXkeWKbJMnh8p/kMgB/BrYjJG+31p4dRmOOzth/BpfoGGNmxiJorT0MwIoI59NWUQdwvESS++1XNp2MwTl3mWe72TlXb7mkAFwYEfN21jLU2doYcNZmUGaS3KF2K1pNjqfpTLXd7Zw7Ocu2SXgxEDPc29t7RBbHWntWwNkly6yF7UVqs6Wnp+fIPD0kl+q4j5oiSNP0pMh+uDaPB2BN4MRDEbMZsrzkvbV2Yd6YukS3yZJLkuRYUxQkXwsc2JwXamvt+WEU0jRF4OR8ffeJMaa7gI4rdbznCov3NnSYKS7J40naDTgPNN8NDg4erOlSZn+oiI5mtJxzp0/IAWNMF8nPgxn9MI8kTraKAsnr9fnqIgKstUM6xltmMgBwVRgF2aw5tBkkPwt4yyqVyiw92MZkjxX5PsnVOvsXTMoB2UBycgYzKmkvEwAWBA78AeDx5uFW5Ntpmh5HclzPk65JOaBi7gnEjGceJMaYRqNxEMlvIntoR19fX1Lwuw8r53IzFTjnCGBPIOSxPB7J6yIO3Fzkm5VKZRaA3wF8LxvfTBUAng2XRNbR7y2/XwLe0iLfc84t1uV645TFq5hGpLy4JY8HYElYhCVJ0lcg+22QSndgYOAo0y5oGes78GO9Xj8ki+OcOyfi+H0Fz5/72yY+lt9VzIIsjvYG4T4YqVarvVkcAHsApG11QCvIrwMH1rdKcSRnq500R6MB794Yx1p7gtZgT5tOAMAN4Yy2OmSkQ9Pytw7giYC3MxYFksvVgVM64oCUvrK5AjFvRIRc7K9jPZTGAt7dPqdWqx0tjkmbaToJAI9E9sKpnkm31FBSAjvnejynng+jYL1U7EV3X0vZMUhNHs4mgGc8oYu0ZrrG58myiPQYd3k9wiapZDsq3hOzKnBgX9ao1WqHkvxW8riUEwWy0naJktehXXqgHJgdy+8kb9L/c2M8uaGIpNU7tJP7Kq9haiukowocGNb7pTVZPJLvhecC/81mi82BBIArIrM53rw3yuDNjURvW96lQdshZYSUE4GYpwpQu5ptIvf/7jTTAb9Yk9uzose/c26exxut1WpVMx2Q01R6XhWyZALUbr1P3SudmplOkHxSrh7ldm4iPABXy56pVqsndk5diRIlSpT4v+MfdGI55dCmGm0AAAAASUVORK5CYII=","title":"${data1.title}","message":"${extract}","link":"${data1.content_urls.desktop.page}","taskKey":"J1dMj4sOY8hn"}`
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