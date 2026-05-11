import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importação corrigida: Puxando o HeaderComponent com o nome certo
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('eco-tech');
}