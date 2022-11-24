import { Component, OnInit } from '@angular/core';
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
import { Lote } from '@app/models/Lote';
import { LoteService } from '@app/services/lote.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
  providers: [DatePipe]
})
export class EventoDetalheComponent implements OnInit {

  evento = {} as Evento;
  formulario!: FormGroup;
  estadoSalvar = 'post';

  get eventoId(): number{
  const eventoIdParam = this.activatedRouter.snapshot.paramMap.get('id');
  return eventoIdParam !== null ? +eventoIdParam : 0;
  }

  get modoEditar(): boolean{
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray{
    return this.formulario.get('lotes') as FormArray;
  }

  get form(): any {
    return this.formulario.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService)
  {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {

    if(this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';
                                      //conversão do parâmetro eventoIdParam texto para number
      this.eventoService.getEventoById(+this.eventoId).subscribe({
        next: (evento: Evento) => {
          this.evento = {...evento}; //... atribui todas as propriedades de evento a this.evento
          this.formulario.patchValue(this.evento);
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar o evento.');
          console.error(error);
        },
        complete: () => this.spinner.hide(),
      });

    }
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void{
    this.formulario = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageURL: ['', Validators.required],
      imageAlt: ['', [Validators.required, Validators.minLength(10)]],
      lotes: this.fb.array([])
    })
  }

  adicionarLote(): void{
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup{
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  excluirLote(index: number): void{
    this.lotes.removeAt(index);
  }

  public resetForm(): void {
    this.formulario.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any{
    return {'is-invalid': campoForm?.errors && campoForm?.touched};
  }

  public salvarEvento(): void{
    this.spinner.show();

    if(this.formulario.valid){
      if(this.estadoSalvar === 'post'){
        this.evento = {...this.formulario.value};
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
        this.evento = {id: this.evento.id, ...this.formulario.value};
        this.eventoService.put(this.evento).subscribe({
          next: (result: any) => {this.toastr.success('Evento salvo com sucesso!', 'Sucesso');},
          error: (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao salvar o evento.', 'Erro');
          }
        }).add(() => this.spinner.hide());
      }
    }
  }

  public salvarLote(): void{
    this.spinner.show();
    if(this.form.controls.lotes.valid){
      this.loteService.saveLotes(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com sucesso!','Sucesso');
            this.lotes.reset();
          },
          (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao salvar lotes.', 'Erro');
          }
        ).add(() => this.spinner.hide());
    }
  }


}
