const apiUrl = "https://script.google.com/macros/s/AKfycbx0Cx9flIk7P_ZriTx9Z6CC3YrzGpoT5PcMM-dd19wZzpezIL-Ptr3ZlrKqBIWOgPkJsQ/exec"; // reemplaza con la URL de tu Apps Script

let farmacias = [];

const contenedor = document.getElementById('listaFarmacias');
const provinciaSelect = document.getElementById('provinciaSelect');
const localidadSelect = document.getElementById('localidadSelect');

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    farmacias = data.map(f => {
      // Convertir Inicio y Fin a objetos Date para cálculos
      return {
        ...f,
        InicioObj: new Date(f.Inicio),
        FinObj: new Date(f.Fin)
      };
    });
    cargarFiltros();
    mostrarFarmacias(farmacias);
  })
  .catch(err => console.error("Error cargando API:", err));

function cargarFiltros() {
  const provincias = [...new Set(farmacias.map(f => f.Provincia))].sort();
  const localidades = [...new Set(farmacias.map(f => f.Localidad))].sort();

  provincias.forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p;
    provinciaSelect.appendChild(option);
  });

  localidades.forEach(l => {
    const option = document.createElement('option');
    option.value = l;
    option.textContent = l;
    localidadSelect.appendChild(option);
  });

  provinciaSelect.addEventListener('change', filtrarFarmacias);
  localidadSelect.addEventListener('change', filtrarFarmacias);
}

function filtrarFarmacias() {
  const prov = provinciaSelect.value;
  const loc = localidadSelect.value;

  let filtradas = farmacias;
  if (prov) filtradas = filtradas.filter(f => f.Provincia === prov);
  if (loc) filtradas = filtradas.filter(f => f.Localidad === loc);

  mostrarFarmacias(filtradas);
}

function mostrarFarmacias(lista) {
  contenedor.innerHTML = "";
  lista.forEach(f => {
    // Formatear fechas y horas legibles
    const inicioStr = f.InicioObj.toLocaleString();
    const finStr = f.FinObj.toLocaleString();

    const div = document.createElement('div');
    div.className = 'farmacia';
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
