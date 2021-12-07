import { OpenStreetMapProvider } from 'leaflet-geosearch';

if( document.querySelector('#map') ) {
    const lat = 24.0277;
    const lgn = -104.653;
    const map = L.map('map').setView([lat, lgn], 15);
    const myIcon = L.icon({
        iconUrl: 'img/pin_market_map.png',
        iconSize: [35,35],
        // iconAnchor: [22, 94],
        // popupAnchor: [-3, -76],        
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
    });
    let marker;
    
    document.addEventListener('DOMContentLoaded', () => {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        // buscar la direccion
        const  buscador = document.querySelector('#formbuscador');
        buscador.addEventListener('input', buscarDireccion);
    
    })
    
    function buscarDireccion(e) {
        if(e.target.value.length > 8) {
            // console.log('Buscando') ;
    
            //utilizamos el prvader
            const provider = new OpenStreetMapProvider();
            provider.search({ query: e.target.value }).then((resultado) => {
                console.log(resultado);
        
                // ubicamos el mapa en base a la busqueda
                map.setView(resultado[0].bounds[0], 15);
                
                //Agregar el pin
                marker = new L.marker(resultado[0].bounds[0], {
                    icon: myIcon,
                    draggable: true,
                    autoPan: true
                })
                .addTo(map)
                .bindPopup(resultado[0].label)
                .openPopup()

            })
    
    
            // console.log(provider);
        }
    }
    
    
    // L.marker([51.5, -0.09]).addTo(map)
    //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //     .openPopup();

}  // if exite elemento map
