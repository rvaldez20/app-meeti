import { OpenStreetMapProvider } from 'leaflet-geosearch';

if( document.querySelector('#map') ) {
    const lat = 24.0277;
    const lgn = -104.653;
    
    const map = L.map('map').setView([lat, lgn], 15);
    
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
                
                //Agregar el pin
    
            })
    
    
            // console.log(provider);
        }
    }
    
    
    // L.marker([51.5, -0.09]).addTo(map)
    //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //     .openPopup();

}  // if exite elemento map
