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
