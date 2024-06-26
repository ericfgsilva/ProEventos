import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RedeSocial } from '@app/models/RedeSocial';
import { RedeSocialService } from '@app/services/redeSocial.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-redesSociais',
  templateUrl: './redesSociais.component.html',
  styleUrls: ['./redesSociais.component.scss']
})
export class RedesSociaisComponent implements OnInit {

  modalRef?: BsModalRef;
  @Input() eventoId = 0;
  public formRS: FormGroup;
  public redeSocialAtual = {id: 0, nome: '', indice: 0};

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router,
    private redeSocialService: RedeSocialService,
  ) { }

  ngOnInit() {
    this.carregarRedesSociais(this.eventoId);
    this.validation();
  }

  private carregarRedesSociais(id: number = 0): void {
    let origem = 'palestrante';

    if(this.eventoId !== 0) origem = 'evento';

    this.spinner.show();
    this.redeSocialService.getRedesSociais(origem, id)
      .subscribe(
        (redeSocialRetorno: RedeSocial[]) => {
          redeSocialRetorno.forEach((redeSocial) => {
            this.redesSociais.push(this.criarRedeSocial(redeSocial));
          });
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar redes sociais.', 'Erro');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
  }

  public validation(): void{
    this.formRS = this.fb.group({
      redesSociais: this.fb.array([])
    });
  }

  public get redesSociais(): FormArray{
    return this.formRS.get('redesSociais') as FormArray;
  }

  public retornaIconeRedeSocial(icone: string): string {
    return icone === null || icone === '' ? '' : 'fab fa-'+icone;
  }

  public retornaTituloRedeSocial(nome: string): string {
    return nome === null || nome === '' ? 'Rede social' : nome;
  }

  public adicionarRedeSocial(): void{
    this.redesSociais.controls.reverse();
    this.redesSociais.push(this.criarRedeSocial({id: 0} as RedeSocial));
    this.redesSociais.controls.reverse();
  }

  public criarRedeSocial(redeSocial: RedeSocial): FormGroup{
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  public confirmarDeleteRedeSocial(): void{
    let origem = 'palestrante';
    this.modalRef?.hide();
    this.spinner.show();

    if(this.eventoId !== 0) origem = 'evento';

    this.redeSocialService
      .deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id)
      .subscribe(
        () => {
          this.toastr.success('Rede Social removida com sucesso!', 'Sucesso');
          this.redesSociais.removeAt(this.redeSocialAtual.indice);
          },
          (error: any) => {
            console.error(error);
            this.toastr.error(`Erro ao tentar remover Rede Social ${this.redeSocialAtual.nome}.`, 'Erro');
          }
      ).add(() => this.spinner.hide());
  }

  public abortarDeleteRedeSocial(): void{
    this.modalRef?.hide();
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any{
    return {'is-invalid': campoForm?.errors && campoForm?.touched};
  }

  public salvarRedesSociais(): void{
    let origem = 'palestrante';

    if(this.eventoId !== 0) origem = 'evento';

    if(this.redesSociais.valid){
      this.spinner.show();
      this.redeSocialService.saveRedesSociais(origem, this.eventoId, this.formRS.value.redesSociais) //this.redesSociais.value
        .subscribe(
          () => {
            this.toastr.success('Redes Sociais salvas com sucesso!','Sucesso');
          },
          (error: any) => {
            this.toastr.error('Erro ao salvar redes sociais.', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }
  }

  public salvarRedeSocial(redeSocial: RedeSocial): void{
    let origem = 'palestrante';

    if(this.eventoId !== 0) origem = 'evento';

    if(this.redeSocialValida(redeSocial)){
      this.spinner.show();
      this.redeSocialService.saveRedesSociais(origem, this.eventoId, [redeSocial])
        .subscribe(
          () => {
            this.toastr.success('Rede Social salva com sucesso!','Sucesso');
            this.router.navigate([`eventos/detalhe/${this.eventoId}`]);
          },
          (error: any) => {
            this.toastr.error('Erro ao salvar rede social.', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }
  }

  public removerRedeSocial(template: TemplateRef<any>, indice: number): void{
    this.redeSocialAtual.id = this.redesSociais.get(indice+'.id')?.value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice+'.nome')?.value;
    this.redeSocialAtual.indice = indice;

    if(this.redeSocialAtual.id !== 0){

      this.modalRef = this.modalService.show(template, {class:'modal-sm' });
    }else{

      this.redesSociais.removeAt(this.redeSocialAtual.indice);
    }
  }

  redeSocialValida(redeSocial: RedeSocial): boolean{
    return redeSocial.nome !== ''
           && redeSocial.url !== ''
           && redeSocial.eventoId !== null
           && redeSocial.palestranteId !== null
  }
}
