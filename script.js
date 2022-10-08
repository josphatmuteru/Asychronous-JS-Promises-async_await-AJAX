'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

/*
const getCountryAndNeighbour = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2//name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render country 1
    renderCountry(data);

    // Get neighbour country
    const [neighbour] = data.borders;

    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2//alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    });
  });
};
getCountryAndNeighbour('Kenya');

setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 seconds passed');
    setTimeout(() => {
      console.log('3 seconds passed');
      setTimeout(() => {
        console.log('4 seconds passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
*/
// add

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2//name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };
// getCountryData('portugal');

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2//name/${country}`)
//     .then(response => response.json())
//     .then(data => {
//       renderCountry(data[0]);
//       console.log(data);
//       const neighbour = data[0].borders[0];

//       console.log(neighbour);

//       if (!neighbour) return;

//       //country 2
//       return fetch(`https://restcountries.com/v2//name/${neighbour}`);
//     })
//     .then(response => response.json())
//     .then(data2 => renderCountry(data2[0], 'neighbour'));
// };
// getCountryData('germany');
// const request = fetch('https://restcountries.com/v2//name/${neighbour}');

const getJSON = function (url, errMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errMsg} (${response.status})`);

    return response.json();
  });
};

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2//name/${country}`)
//     .then(response => {
//       response.json();
//       if (!response.ok) throw new Error(`Country not found ${response.status}`);
//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbour = data[0].borders[0];
//       console.log(neighbour);
//       if (!neighbour) return;

//       // country 2
//       return fetch(`https://restcountries.com/v2//alpha/${neighbour}`);
//     })
//     .then(response => response.json())
//     .then(data => renderCountry(data, 'neighbour'))
//     .catch(err => {
//       console.error(`${err}`);
//       renderError(`Something went wrong ${err.message}. Try again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };
// // getCountryData('Finland');
// btn.addEventListener('click', function () {
//   getCountryData('kasfkj');
// });
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v2//name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);

      let neighbour = '';
      !data[0].borders ? (neighbour = false) : (neighbour = data[0].borders[0]);
      // console.log(data[0].borders);
      if (!neighbour) throw new Error('No neighbour found!');

      // country 2
      return getJSON(
        `https://restcountries.com/v2//alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
// getCountryData('Finland');

const whereAmI = function (lat, lng) {
  var requestOptions = {
    method: 'GET',
  };
  return (
    fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=dd7cefac26ab4684b2c6f369606e2ea1`,
      requestOptions
    )
      .then(response => {
        if (response.status === 403)
          throw new Error('Too many requests! Slow down');
        return response.json();
      })
      // .then(result => console.log(result));
      .then(result => {
        const data = result.features[0].properties;
        console.log(`You are in ${data.city}, ${data.country}`);

        return fetch(`https://restcountries.com/v2//name/${data.country}`);
      })
      .then(response => {
        if (!response.ok)
          throw new Error(`Country not found (${response.status})`);
        return response.json();
      })
      .then(data => renderCountry(data[0]))
      .finally(() => {
        countriesContainer.style.opacity = 1;
      })
      .catch(error => console.log('error', error))
  );
};

// btn.addEventListener('click', function () {
//   whereAmI(-33.933, 18.474);
//   // getCountryData('australia');
// });

//Asynchronous Javascript behind the scenes
/*
// executed first
console.log('Test Start');

setTimeout(() => {
  // executed last because of microtasks queu having more priority than than the callback queu in which this line will be placed
  console.log('0 sec timer'), 0;
});
// executed third
Promise.resolve('Resolved promise 1').then(res => console.log(res));

// executed fourth
Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 100000; i++) {}
  console.log(res);
});

//executed second
console.log('Test end');
*/
/*

// creating a promise from scratch
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You win!');
    } else {
      reject(new Error('You lost your money'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Promisifying setTimeout
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('I waited for 2 seconds');
    return wait(1);
  })
  .then(() => console.log('I waited for 1 second'));

Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('Problem!')).catch(x => console.error(x));
*/

/*
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // naviagator.geolocation.getCurrentPosition(position => resolve(position), err => reject(err))

    navigator.geolocation.getCurrentPosition(resolve, reject);
  }).then(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    console.log(pos);
    console.log(lat, lng);
    whereAmI(lat, lng);
  });
};
// getPosition().then(pos => console.log(pos));

btn.addEventListener('click', function () {
  getPosition();
  // whereAmI(-33.933, 18.474);
  // getCountryData('australia');
});
*/

/*
/////////////// coding challenge 2 //////////////

const imgContainer = document.querySelector('.images');
// './img/img-1.jpg';
// './img/img-2.jpg';

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const errorHandler = function (errMsg) {
  imgContainer.insertAdjacentHTML('beforeend', errMsg);
};
const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const image = document.createElement('img');
    image.src = imgPath;

    image.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });

    image.addEventListener('load', function () {
      imgContainer.append(image);
      resolve(image);
    });
  });
};
let currentImg = '';
createImage('./img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('./img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
  });
*/

////////ASYNC AWAIT ///////////
const getPosition = async function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI2 = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse Geocoding
    var requestOptions = {
      method: 'GET',
    };
    const resGeo = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=dd7cefac26ab4684b2c6f369606e2ea1`,
      requestOptions
    );
    if (!resGeo.ok) throw new Error('Problem getting country data');

    const geoResults = await resGeo.json();
    const dataGeo = geoResults.features[0].properties;
    console.log(dataGeo.country);
    // Country data
    const res = await fetch(
      `https://restcountries.com/v2//name/${dataGeo.country}`
    );

    if (!resGeo.ok) throw new Error('Problem getting country data');
    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
    countriesContainer.style.opacity = 1;
  } catch {
    console.error(`${err}`);
    renderError(`${err.message}`);
    // Reject promise returned from async function
    throw err;
  }
};
console.log(`1: will get location`);

// whereAmI2()
//   .then(city => console.log(city))
//   .catch(err => console.error(`2: ${err.message}`))
//   .finally(() => console.log('3: finished getting location'));
/*
(async function () {
  try {
    const city = await whereAmI2();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2:${err.message}`);
  }
  console.log('3: finished getting location');
})();
*/

///////////////// Promise.all/////////////
/*
const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v2//name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v2//name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v2//name/${c3}`);
    // console.log([data1.capital, data2.capital, data3.capital]);
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v2//name/${c1}`),
      getJSON(`https://restcountries.com/v2//name/${c2}`),
      getJSON(`https://restcountries.com/v2//name/${c3}`),
    ]);

    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};
get3Countries('Kenya', 'Tanzania', 'Djibouti');
*/

/*
///////// Promise.race //////////////////
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v2//name/italy`),
    getJSON(`https://restcountries.com/v2//name/mexico`),
    getJSON(`https://restcountries.com/v2//name/spain`),
  ]);
  console.log(res[0]);
})();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long!'));
    }, sec * 1000);
  });
};
Promise.race([
  getJSON(`https://restcountries.com/v2//name/mexico`),
  timeout(0.1),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

//////// Promise.allSettled ///////
Promise.allSettled([
  Promise.resolve('success'),
  Promise.reject('error'),
  Promise.resolve('success'),
])
  .then(res => console.log(res))
  .catch(err => console.log(err));

//////// Promise.any ///////
Promise.any([
  Promise.resolve('success'),
  Promise.reject('error'),
  Promise.resolve('success'),
])
  .then(res => console.log(res))
  .catch(err => console.log(err));
*/

////////Coding challenge 3///////
const imgContainer = document.querySelector('.images');
// './img/img-1.jpg';
// './img/img-2.jpg';
const wait = async function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const errorHandler = function (errMsg) {
  imgContainer.insertAdjacentHTML('beforeend', errMsg);
};
const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const image = document.createElement('img');
    image.src = imgPath;

    image.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });

    image.addEventListener('load', function () {
      imgContainer.append(image);
      resolve(image);
    });
  });
};
let currentImg = '';
createImage('./img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('./img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
  });

const loadNPause = async function () {
  try {
    let img = await createImage('./img/img-1.jpg');
    console.log('Image 1 loaded');
    await wait(2);

    img.style.display = 'none';
    img = await createImage('./img/img-2.jpg');
    await wait(2);

    img.style.display = 'none';
  } catch (err) {
    console.error(err.message);
  }
};

// loadNPause();

const loadAll = async function (imgArr) {
  try {
    const imgs = imgArr.map(async img => await createImage(img));
    const imgsEl = await Promise.all(imgs);
    console.log(imgsEl);
    imgsEl.forEach(img => {
      img.classList.add('parallel');
    });
  } catch (err) {
    console.error(err);
  }
};

loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);

// let currentImg = '';
// createImage('./img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     console.log('Image1 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('./img/img-2.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     console.log('Image2 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   });
