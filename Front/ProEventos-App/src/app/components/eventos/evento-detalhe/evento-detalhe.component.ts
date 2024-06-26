import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { EventoService } from '@app/services/evento.service';
import { Evento } from '@app/models/Evento';
import { LoteService } from '@app/services/lote.service';
import { Lote } from '@app/models/Lote';
import { DatePipe } from '@angular/common';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
  providers: [DatePipe]
})
export class EventoDetalheComponent implements OnInit {

  modalRef?: BsModalRef;
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = 'post';
  loteAtual = {id: 0, nome: '', indice: 0};
  imagemURL = 'assets/img/upload.png';
  file!: File;

  get eventoId(): number{
    const eventoIdParam = this.activatedRouter.snapshot.paramMap.get('id');
    return eventoIdParam !== null ? +eventoIdParam : 0;
  }

  get modoEditar(): boolean{
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  get bsConfigData(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private loteService: LoteService,
    private datePipe: DatePipe
  ){
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {

    if(this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';
      //conversão do parâmetro eventoIdParam texto para number
      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
          if(this.evento.imageURL !== '' && this.evento.imageURL !== null){
            this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imageURL;
          }
          //esta forma é mais eficaz em relação ao carregarLotes() uma vez que o objeto evento já retorna a lista de lotes
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          });
          //this.carregarLotes();
          this.form.setValue({'imageURL': this.evento.imageURL, 'imageAlt': this.evento.imageAlt});
        },
        error: (error: any) => {
          this.toastr.error('Erro ao tentar carregar o evento.','Erro');
          console.error(error);
        }
      }).add(() => this.spinner.hide());
    }
  }

  //Exemplo de outra possibilidade para carregar o lote em um segundo acesso ao banco.
  //Poderia ser utilizado caso o objeto pretendido não estivesse já como parte do evento por exemplo.
  public carregarLotes(): void {
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar carregar lotes.','Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void{
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', [Validators.required, Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      imageURL: [''],
      lotes: this.fb.array([]),
    });
  }

  public mudarValorData(value: Date, indice: number, campo: string): void{
    this.lotes.value[indice][campo] = value;
  }

  public adicionarLote(): void{
    this.lotes.controls.reverse();
    this.lotes.push(this.criarLote({id: 0} as Lote));
    this.lotes.controls.reverse();
  }

  public criarLote(lote: Lote): FormGroup{
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public removerLote(template: TemplateRef<any>, indice: number): void{
    this.loteAtual.id = this.lotes.get(indice+'.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice+'.nome')?.value;
    this.loteAtual.indice = indice;

    if(this.loteAtual.id !== 0){

      this.modalRef = this.modalService.show(template, {class:'modal-sm' });
    }else{

      this.lotes.removeAt(this.loteAtual.indice);
    }

  }

  public confirmarDeleteLote(): void{
    this.modalRef?.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
    .subscribe(
      () => {
        this.toastr.success('Lote removido com sucesso!', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
        },
        (error: any) => {
          console.error(error);
          this.toastr.error(`Erro ao tentar remover lote ${this.loteAtual.nome}.`, 'Erro');
        }
      ).add(() => this.spinner.hide());
  }

  public abortarDeleteLote(): void{
    this.modalRef?.hide();
  }

  public retornaTituloLote(nome: string): string {
    return nome === null || nome === '' ? 'Novo lote' : nome;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any{
    return {'is-invalid': campoForm?.errors && campoForm?.touched};
  }

  public salvarEvento(): void{
    if(this.form.valid){
      this.spinner.show();
      if(this.estadoSalvar == 'post'){
        this.evento = {...this.form.value};
        this.eventoService.post(this.evento).subscribe({
          next: (eventoRetorno: Evento) => {
            this.toastr.success('Evento criado com sucesso!', 'Sucesso');
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },
          error: (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao criar o evento.', 'Erro');
          }
        }).add(() => this.spinner.hide());
      }else{
        this.evento = {id: this.evento.id, imageURL: this.evento.imageURL, imageAlt: this.evento.imageAlt, ...this.form.value};
        this.eventoService.put(this.evento).subscribe({
          next: (result: any) => {
            this.toastr.success('Evento salvo com sucesso!', 'Sucesso');
            this.evento = result;
            this.form.patchValue(this.evento);
          },
          error: (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao salvar o evento.', 'Erro');
          }
        }).add(() => this.spinner.hide());
      }
    }
  }

  public salvarLotes(): void{
    if(this.f.lotes.valid){
      this.spinner.show();
      this.loteService.saveLotes(this.eventoId, this.f.lotes.value)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com sucesso!','Sucesso');
            this.router.navigate([`eventos/detalhe/${this.evento.id}`]);
          },
          (error: any) => {
            this.toastr.error('Erro ao salvar lotes.', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }
  }

  public salvarLote(lote: Lote): void{
    if(this.loteValido(lote)){
      this.spinner.show();
      this.loteService.saveLotes(this.eventoId, [lote])
        .subscribe(
          () => {
            this.toastr.success('Lote salvo com sucesso!','Sucesso');
            this.router.navigate([`eventos/detalhe/${this.evento.id}`]);
          },
          (error: any) => {
            this.toastr.error('Erro ao salvar lote.', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }
  }

  loteValido(lote: Lote): boolean{
    return lote.nome !== ''
           && lote.quantidade > 0
           && lote.preco >= 0
           && lote.dataInicio !== null
           && lote.dataFim !== null;
  }

  onFileChange(ev: any): void{
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files[0];
    reader.readAsDataURL(this.file);

    this.uploadImagem();
  }

  uploadImagem(): void{
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      (result: any) => {
        this.evento = result;
        this.form.patchValue(this.evento);
        this.toastr.success('Imagem atualizada com sucesso.', 'Sucesso');
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar fazer upload da imagem.', 'Erro');
        console.log(error);
      }
    ).add(() => this.spinner.hide());

  }
}
