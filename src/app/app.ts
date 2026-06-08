import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { MapComponent } from './components/map/map';

@Component({
  selector: 'app-root',
  imports: [Header, MapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('eco-tech');
}