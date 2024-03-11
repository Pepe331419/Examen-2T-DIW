var myMap = L.map('myMap').setView([36.7067, -4.4500], 13);
var datosParadas;
var paradaTemplate = document.getElementById("paradaTemplate").content;
var listaParadas = document.getElementById("listaParadas");
var mainModal = document.getElementById("mainModal");

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

function cargaDatos(paradas){
    paradas.forEach(el => {
        let myLat = el.geometry.coordinates[1];
        let myLon = el.geometry.coordinates[0];
        let newMarker = L.marker([myLat, myLon]).addTo(myMap);
        newMarker.bindPopup("<p><strong>"+el.properties.DESCRIPCION+"</strong></p><p>"+el.properties.DIRECCION+"</p>");

        let newModal = document.createElement("dialog");
        newModal.classList.add("modalInfo");
        newModal.setAttribute("id",el.properties.ID);
        newModal.innerHTML = "<strong>"+el.properties.DESCRIPCION+"</strong><p>Capacidad: "+el.properties.INFOESP[0].Capacidad_vehiculos+"</p><p>Identificador: "+el.properties.ID+"</p><button id='btn"+el.properties.ID+"'>Volver</button>";
        document.querySelector("body").appendChild(newModal);

        nuevaEntrada = paradaTemplate.cloneNode(true);
        let parada = nuevaEntrada.querySelector(".parada");
        parada.querySelector(".nombre").textContent = el.properties.DESCRIPCION;
        parada.querySelector(".localizacion").textContent = el.properties.DIRECCION;
        let PMRbutton = parada.querySelector(".accesible");
        PMRbutton.removeEventListener("click", ()=>{});
        el.properties.ACCESOPMR == "Si" ? PMRbutton.classList.remove("hidden") : PMRbutton.classList.add("hidden");

        parada.addEventListener("click", (ev)=>{
            let activo = document.querySelector("li.activated");
            if (activo){
                activo.classList.remove("activated");
            }
            parada.classList.add("activated");
        })
        
        parada.querySelector(".masInfo").addEventListener("click",(ev)=>{
            ev.preventDefault();
            llamarModal(el.properties.DESCRIPCION, el.properties.INFOESP[0].Capacidad_vehiculos, el.properties.ID);
        })
        listaParadas.appendChild(nuevaEntrada);
    });
}

function llamarModal(desc, capac, id){
    mainModal.innerHTML=`<form method="dialog"><strong>${desc}</strong><p>Capacidad:${capac}</p><p>Identificador:${id}</p><button>Volver</button></form>`;
    mainModal.showModal();
}

fetch('../data.json')
    .then(response => response.json())
    .then(data => {
        datosParadas = data.features;
        cargaDatos(datosParadas);
    })
    .catch((error) => {
        console.error(error);
    })