import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.exibirHeader();
  }

  exibirHeader(): any
  {
    //window.location.href = '/user/login';
    return localStorage.getItem('token') != null;
  }

}
