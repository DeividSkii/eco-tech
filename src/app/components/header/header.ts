import { Component, HostListener, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {

  secaoAtiva: string = "inicio";
  
  // Novas variáveis para controlar a linha
  linhaLeft: number = 0;
  linhaWidth: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    // Calcula a posição inicial da linha assim que a tela abre
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.atualizarLinha(), 100);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const secoes = ['inicio', 'sobre', 'doacao', 'contato'];
    let secaoAtual = 'inicio';

    for (const secao of secoes){
      const elemento = document.getElementById(secao);
      if (elemento){
        const rect = elemento.getBoundingClientRect();

        if (rect.top <= 150) {
          secaoAtual = secao;
        }
      }
    }

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10){
      secaoAtual = 'contato';
    }

    // Se a seção mudou, atualiza a variável e manda a linha se mover!
    if (this.secaoAtiva !== secaoAtual) {
      this.secaoAtiva = secaoAtual;
      this.atualizarLinha();
    }
  }

  // A função mágica que lê o tamanho real da palavra na tela
  atualizarLinha() {
    if (isPlatformBrowser(this.platformId)) {
      const linkAtivo = document.getElementById(`link-${this.secaoAtiva}`);
      
      if (linkAtivo) {
        this.linhaLeft = linkAtivo.offsetLeft;
        this.linhaWidth = linkAtivo.offsetWidth;
      }
    }
  }
}