import { Component, OnInit } from '@angular/core';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { Funcao } from '@app/shared/enums/funcao';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public usuario = {} as UserUpdate;

  public get ehPalestrante(): boolean{
    return this.usuario.funcao === Funcao.Palestrante;
  }

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
