import { Component, OnInit } from '@angular/core';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { Funcao } from '@app/shared/enums/funcao';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public usuario = {} as UserUpdate;
  public file: File;
  public imagemURL = '';

  public get ehPalestrante(): boolean{
    return this.usuario.funcao === Funcao.Palestrante;
  }

  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {

  }

  public setFormValue(usuario: UserUpdate): void{
    this.usuario = usuario;
    this.imagemURL = this.usuario.imagemURL != undefined ? environment.apiURL + `resources/perfil/${this.usuario.imagemURL}` : null;
  }

  onFileChange(ev: any): void{
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files[0];
    reader.readAsDataURL(this.file);

    this.uploadImagem();
  }

  private uploadImagem(): void{
    this.spinner.show();
    this.accountService
      .postUpload(this.file)
      .subscribe(
        () => {
          this.toaster.success('Imagem atualizada com sucesso');
        },
        (error: any) => {
          this.toaster.error('Erro ao atualizar imagem');
        }
      ).add(() => this.spinner.hide());
  }



}
