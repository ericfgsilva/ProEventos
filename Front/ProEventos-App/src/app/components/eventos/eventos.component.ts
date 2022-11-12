import { Component, OnInit, TemplateRef } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {

  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm'
  };
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

  public larguraImg = 100;
  public margemImg = 2;
  public exibirImage = true;
  private filtroListado = '';

  public get filtroLista(): string {
    return this.filtroListado;
  }

  public set filtroLista(value: string){
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista ?
                          this.filtrarEventos(this.filtroLista)
                        : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ){}

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public mostrarImagem(){
    this.exibirImage = !this.exibirImage;
  }

  public getEventos(): void {
    const observer = {
      next:(_eventos: Evento[])=>{
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) =>{
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos', 'Erro!');
      },
      complete: () => this.spinner.hide()
    }
    this.eventoService.getEventos().subscribe(observer);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('Ação executada com sucesso!', 'Sucesso!');
  }

  decline(): void {
    this.modalRef?.hide();
    this.toastr.info('Nenhuma ação foi executada!', 'Informação!');
  }

}
