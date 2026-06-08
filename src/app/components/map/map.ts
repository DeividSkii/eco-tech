import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type * as L from 'leaflet';
// A linha "import { After } from 'node:v8';" foi removida daqui!

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.iniciarMapa()
      }, 100)
    }
  }

  private async iniciarMapa() {
    const leaflet = await import('leaflet');
    
    const centroDaCidade: L.LatLngExpression = [-12.266, -38.966];

    this.map = leaflet.map(this.mapContainer.nativeElement).setView(centroDaCidade, 13);
    
    leaflet.tileLayer('https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(this.map);

    const iconePadrao = leaflet.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    
    const pontosDeColeta = [
      { 
        nome: 'Ecoponto Centro', 
        coordenadas: [-12.266, -38.966] as L.LatLngExpression, 
        aceita: 'Pilhas, Baterias e Celulares' 
      },
      { 
        nome: 'Coleta Shopping Boulevard', 
        coordenadas: [-12.253, -38.948] as L.LatLngExpression, 
        aceita: 'Lixo Eletrônico em geral' 
      },
      { 
        nome: 'Ponto de Descarte Norte', 
        coordenadas: [-12.235, -38.970] as L.LatLngExpression, 
        aceita: 'Computadores e Monitores' 
      },
      { 
        nome: 'Eco-Tech Mangabeira', 
        coordenadas: [-12.248, -38.930] as L.LatLngExpression, 
        aceita: 'Cabos, Fontes e Placas' 
      }
    ];

    // Aqui entra a mágica do botão do Maps!
    // Aqui entra a mágica do botão do Maps!
    pontosDeColeta.forEach(ponto => {
      
      // Avisamos ao TypeScript que isso é um array de 2 posições (Tupla)
      const coords = ponto.coordenadas as [number, number];
      const lat = coords[0];
      const lng = coords[1];
      
      // Link oficial de rotas do Google Maps
      const linkMaps = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

      const popUpConteudo = `
        <div style="text-align: center; font-family: sans-serif;">
          <strong style="color: #00A859; font-size: 15px; display: block; margin-bottom: 5px;">${ponto.nome}</strong>
          <span style="color: #666; font-size: 13px;">Aceita: ${ponto.aceita}</span>
          <br>
          <a href="${linkMaps}" target="_blank" style="
            display: inline-block;
            margin-top: 12px;
            padding: 8px 15px;
            background-color: #00A859;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">Traçar Rota no Maps</a>
        </div>
      `;

      leaflet.marker(ponto.coordenadas, { icon: iconePadrao })
        .addTo(this.map)
        .bindPopup(popUpConteudo);
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }
}