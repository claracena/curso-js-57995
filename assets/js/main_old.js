/*
 * curso-js-57995
 * Alumno: Cesar Aracena
 * Profesor: Adrián Gonzalez
 * Tutor: Yoelis Figueredo Padrón
 * Repositorio: https://github.com/claracena/curso-js-57995
 *
 * Este código forma parte de las entregas realizadas y con lo
 * aprendido durante el curso de JS, en la comisión 57995, liderada
 * por el profesor Adrián Gonzalez.
 *
 * El sistema permite elegir los componentes adecuados y compatibles
 * entre si, para el armado de una computadora de escritorio moderna.
 *
 */

// Endpoints fijos para obtener los productos que se utilizaran en la pagina
const apiEndpointProcessors =
    "https://javascript.cesararacena.com/json/processors.json";
const apiEndpointMotherboards =
    "https://javascript.cesararacena.com/json/motherboards.json";

// Funcion asincronica para bajar y procesar el JSON con
// informacion de los procesadores
const getDataProcessors = async () => {
    const res = await fetch(apiEndpointProcessors);
    const data = await res.json();
    // console.log(data);
    return data;
};

// Funcion asincronica para bajar y procesar el JSON con
// informacion de los motherboards
const getDataMotherboards = async () => {
    const res = await fetch(apiEndpointMotherboards);
    const data = await res.json();
    // console.log(data[0]["manufacturer"]);
    return data;
};

// Funcion asincronica para extraer informacion
// de los procesadores disponibles y llenar el "select"
// del HTML adecuado
const displayProcessorInfo = async () => {
    const payload = await getDataProcessors();
    let element = document.getElementById("processor_select");

    for (let i = 0; i < payload.length; i += 1) {
        element.innerHTML =
            element.innerHTML +
            '<option value="' +
            payload[i]["processor_id"] +
            '">' +
            payload[i]["manufacturer"] +
            " " +
            payload[i]["commercial_name"] +
            "</option>";
    }
};

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
