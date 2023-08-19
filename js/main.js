const apiEndpointProcessors = "https://claracena.github.io/curso-js-57995/json/processors.json";
const apiEndpointMotherboards = "https://claracena.github.io/curso-js-57995/json/motherboards.json";

const getDataProcessors = async () => {
    const res = await fetch(apiEndpointProcessors);
    const data = await res.json();
    // console.log(data);
    return data;
}

const getDataMotherboards = async () => {
    const res = await fetch(apiEndpointMotherboards);
    const data = await res.json();
    // console.log(data[0]["manufacturer"]);
    return data;
}

const displayProcessorInfo = async () => {
    const payload = await getDataProcessors();
    let element = document.getElementById('processor_select');

    for (let i = 0; i < payload.length; i += 1) {
        element.innerHTML = element.innerHTML +
        '<option value="' + payload[i]['processor_id'] + '">'
        + payload[i]['manufacturer']
        + ' '
        + payload[i]['commercial_name']
        + '</option>';
    }
}

// const displayProcessorInfo = async () => {
//     const payload = await getDataProcessors();

//     let dataDisplay = payload.map((object) => {
//         const { manufacturer, commercial_name } = object;

//         return `
//         <div class="container">
//         <p>Fabricante: ${manufacturer}</p>
//         <p>Nombre: ${commercial_name}</p>
//         </div>
//         `
//     }).join("<hr>");

//     display.innerHTML = dataDisplay;
// }

// const displayMotherboardsInfo = async () => {
//     const payload = await getDataMotherboards();

//     let dataDisplay = payload.map((object) => {
//         const { manufacturer, commercial_name } = object;

//         return `
//         <div class="container">
//         <p>Fabricante: ${manufacturer}</p>
//         <p>Nombre: ${commercial_name}</p>
//         </div>
//         `
//     }).join("<hr>");

//     display.innerHTML = dataDisplay;
// }

displayProcessorInfo();
// displayMotherboardsInfo();
