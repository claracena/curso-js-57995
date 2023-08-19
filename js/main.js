const apiEndpoint = "https://claracena.github.io/curso-js-57995/json/processors.json";
// const apiEndpoint = "https://claracena.github.io/curso-js-57995/json/motherboards.json";
const display = document.querySelector("#display-data");

const getData = async () => {
    const res = await fetch(apiEndpoint);
    const data = await res.json();
    console.log(data);
    return data;
}

const displayProcessorInfo = async () => {
    const payload = await getData();

    let dataDisplay = payload.map((object) => {
        const { manufacturer, commercial_name } = object;

        return `
        <div class="container">
        <p>Fabricante: ${manufacturer}</p>
        <p>Nombre: ${commercial_name}</p>
        </div>
        `
    }).join("<hr>");

    display.innerHTML = dataDisplay;
}

displayProcessorInfo();
