import { Component, Inject, PLATFORM_ID, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import type * as L from 'leaflet';

// Uma interface para padronizar os dados vindos da api
export interface PontoDeColeta {
  id?: number | string; 
  nome: string;
  lat: number;
  lng: number;
  aceita: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private leaflet: any;

  private API_URL = 'https://6a2756b5a84f9d39e90877fd.mockapi.io/pontos'; 

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient 
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.iniciarMapa();
      }, 100);
    }
  }

  private async iniciarMapa() {
    this.leaflet = await import('leaflet');
    
    const centroDaCidade: L.LatLngExpression = [-12.266, -38.966];

    this.map = this.leaflet.map(this.mapContainer.nativeElement).setView(centroDaCidade, 13);
    
    this.leaflet.tileLayer('https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(this.map);

    // Busca os dados na API
    this.buscarPontosDeColeta();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

 //Método GET para buscar dados na API
  private buscarPontosDeColeta() {
    this.http.get<PontoDeColeta[]>(this.API_URL).subscribe({
      next: (pontos: PontoDeColeta[]) => {
        // Se retornar sucesso, coloca os pontos no mapa
        this.desenharMarcadores(pontos);
      },
      error: (erro: any) => {
        console.error('Erro ao buscar pontos na API', erro);
      }
    });
  }

  //Método POST, adiciona um novo ponto na API
  public adicionarNovoPonto(novoPonto: PontoDeColeta) {
    this.http.post<PontoDeColeta>(this.API_URL, novoPonto).subscribe({
      next: (pontoSalvo: PontoDeColeta) => {
        alert('Ponto adicionado com sucesso!');
        // Após salvar, desenhamos ele no mapa imediatamente
        this.desenharMarcadores([pontoSalvo]); 
      },
      error: (erro: any) => {
        console.error('Erro ao salvar o ponto', erro);
      }
    });
  }

  //Função para desenhar o marcador no mapa
  private desenharMarcadores(pontos: PontoDeColeta[]) {
    const iconePadrao = this.leaflet.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    pontos.forEach(ponto => {
      // O link Maps oficial
      const linkMaps = `https://www.google.com/maps/dir/?api=1&destination=${ponto.lat},${ponto.lng}`;

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

      // Adicionando marcador
      this.leaflet.marker([ponto.lat, ponto.lng], { icon: iconePadrao })
        .addTo(this.map)
        .bindPopup(popUpConteudo);
    });
  }
}