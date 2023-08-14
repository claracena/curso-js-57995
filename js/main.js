// async function fetchDataAsync(url) {
//     const response = await fetch(url.json());
    // const resp = await JSON.parse(response);
    // console.log(await response.json());
    // document.write(await response.json());
    // console.log(JSON.parse(response));
    // return await response;
    // console.log(Object.keys(response).map(function(_) { return j[_]; }));
// }

// fetchDataAsync(
//     "https://claracena.github.io/curso-js-57995/json/processors.json"
// );

// let resp = fetchDataAsync('https://claracena.github.io/curso-js-57995/json/processors.json');

// console.log(resp);
// document.write(resp);

let url = "https://claracena.github.io/curso-js-57995/json/processors.json"
fetch(url)
  .then(res => res.json())
  .then(out =>
    console.log('Checkout this JSON! ', JSON.parse(out)))
  .catch(err => { throw err });