const apiUrl = "https://script.google.com/macros/s/AKfycbyuOWtyatPr6ey3ApBbu-7VmwIyPe83LULY6XpCtQTKTbIzzlRZA5nO6cZ_tT6gjR-pTw/exec"; // pega la URL /exec de tu Apps Script aquí

let farmacias = [];

const contenedor = document.getElementById('listaFarmacias');
const provinciaSelect = document.getElementById('provinciaSelect');
const localidadSelect = document.getElementById('localidadSelect');

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    farmacias = data.map(f => ({ ...f, InicioObj: new Date(f.Inicio), FinObj: new Date(f.Fin) }));
    cargarFiltros();
    mostrarFarmacias(farmacias);
  })
  .catch(err => console.error("Error cargando API:", err));

function cargarFiltros() {
  const provincias = [...new Set(farmacias.map(f => f.Provincia))].sort();
  const localidades = [...new Set(farmacias.map(f => f.Localidad))].sort();

  provincias.forEach(p => { const option = document.createElement('option'); option.value=p; option.textContent=p; provinciaSelect.appendChild(option); });
  localidades.forEach(l => { const option = document.createElement('option'); option.value=l; option.textContent=l; localidadSelect.appendChild(option); });

  provinciaSelect.addEventListener('change', filtrarFarmacias);
  localidadSelect.addEventListener('change', filtrarFarmacias);
}

function filtrarFarmacias() {
  const prov = provinciaSelect.value;
  const loc = localidadSelect.value;
  let filtradas = farmacias;
  if (prov) filtradas = filtradas.filter(f=>f.Provincia===prov);
  if (loc) filtradas = filtradas.filter(f=>f.Localidad===loc);
  mostrarFarmacias(filtradas);
}

function mostrarFarmacias(lista) {
  contenedor.innerHTML="";
  lista.forEach(f=>{
    const inicioStr = f.InicioObj.toLocaleString();
    const finStr = f.FinObj.toLocaleString();
    const div = document.createElement('div');
    div.className='farmacia';
    div.innerHTML = `
      <h2>${f.Nombre}</h2>
      <p>Dirección: ${f.Dirección}</p>
      <p>Localidad: ${f.Localidad}</p>
      <p>Provincia: ${f.Provincia}</p>
      <p>Turno: ${inicioStr} - ${finStr}</p>
      <p>Teléfono: <a href="tel:${f.Teléfono}">${f.Teléfono}</a></p>
    `;
    contenedor.appendChild(div);
  });
}
