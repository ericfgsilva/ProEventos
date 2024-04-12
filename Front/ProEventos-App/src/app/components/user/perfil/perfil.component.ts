import { Component, OnInit } from '@angular/core';
import { UserUpdate } from '@app/models/identity/UserUpdate';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public usuario = {} as UserUpdate;

  constructor() { }

  ngOnInit(): void {

  }

  public getFormValue(usuario: UserUpdate): void{
    this.usuario = usuario;
  }

  get f(): any{
    return '';
  }




}
