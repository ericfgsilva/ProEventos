import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})

export class TituloComponent implements OnInit {

  @Input()
  titulo!: string;

  constructor() { /*TODO document why this constructor is empty */}

  ngOnInit(): void {/*TODO document why this method 'ngOnInit' is empty*/}

}
