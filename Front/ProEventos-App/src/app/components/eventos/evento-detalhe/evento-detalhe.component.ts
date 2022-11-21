import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  evento = {} as Evento;
  formulario!: FormGroup;
  estadoSalvar = 'post';

  get form(): any {
    return this.formulario.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService)
  {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam != null) {
      this.spinner.show();

      this.estadoSalvar = 'put';
                                      //conversão do parâmetro eventoIdParam texto para number
      this.eventoService.getEventoById(+eventoIdParam).subscribe({
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
    })
  }

  public resetForm(): void {
    this.formulario.reset();
  }

  public cssValidator(campoForm: FormControl): any{
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvarAlteracao(): void{
    this.spinner.show();

    if(this.formulario.valid){
      if(this.estadoSalvar === 'post'){
        this.evento = {...this.formulario.value};
        this.eventoService.post(this.evento).subscribe({
          next: (result: any) => {this.toastr.success('Evento criado com sucesso!', 'Sucesso');},
          error: (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao criar o evento', 'Erro');
          }
        }).add(() => this.spinner.hide());
      }else{
        this.evento = {id: this.evento.id, ...this.formulario.value};
        this.eventoService.put(this.evento).subscribe({
          next: (result: any) => {this.toastr.success('Evento salvo com sucesso!', 'Sucesso');},
          error: (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao salvar o evento', 'Erro');
          }
        }).add(() => this.spinner.hide());
      }
    }
  }
  }
