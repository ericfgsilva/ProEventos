import { Component } from '@angular/core';
import { TituloComponent } from './shared/titulo/titulo.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProEventos-App';
  tituloPagina = 'ProEvento';
}
