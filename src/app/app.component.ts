import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface FraseData {
  frase: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('taller-pwa1');
  protected readonly frase = signal<string>('Cargando frase...');
  protected readonly isOnline = signal<boolean>(navigator.onLine);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));

    // Al cargar la app, se ejecuta automáticamente esta petición
    this.http.get<FraseData>('/data/frases.json').subscribe({
      next: (res) => {
        console.log('Datos dinámicos cargados por la PWA:', res);
        if (res && res.frase) {
          this.frase.set(res.frase);
        }
      },
      error: (err) => {
        console.error('Error al solicitar los datos:', err);
        this.frase.set('Error al cargar la frase.');
      }
    });
  }
}
