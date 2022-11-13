import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})

export class TituloComponent implements OnInit {

  @Input() titulo = 'Pro Eventos';
  @Input() iconClass = 'fa fa-user';
  @Input() subtitulo = 'Desde 2021';
  @Input() botaoListar = false;

  constructor() { /*TODO document why this constructor is empty */}

  ngOnInit(): void {/*TODO document why this method 'ngOnInit' is empty*/}

}
