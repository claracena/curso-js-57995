const apiEndpoint = "https://claracena.github.io/curso-js-57995/json/processors.json";
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
        const { number, commercial_name } = object;

        return `
        <div class="container">
        <p>N&uacute;mero: ${number}</p>
        <p>Nombre: ${commercial_name}</p>
        </div>
        `
    }).join("");

    display.innerHTML = dataDisplay;
}

displayProcessorInfo();
