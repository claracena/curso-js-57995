let version = new Date().getTime();
const script_name = './assets/js/app.js';
const div = document.getElementById('myScript');
let full_script = script_name + '?=' + version;
div.append(full_script);
console.log(full_script);