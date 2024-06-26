import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject, debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef?: BsModalRef;

  public eventos: Evento[] = [];
  public eventoId = 0;
  public pagination = {} as Pagination;

  public larguraImg = 100;
  public margemImg = 2;
  public exibirImage = true;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm'
  };

  public filtrarEventos(evt: any): void {
    if(evt.value.toString().trim().length != 0){
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.eventoService.getEventos(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          ).subscribe(
            (paginatedResult: PaginatedResult<Evento[]>) => {
              this.eventos = paginatedResult.result;
              this.pagination = paginatedResult.pagination;
            },
            (error: any) => {
              console.error(error);
              this.spinner.hide();
              this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
            }
          ).add(() => this.spinner.hide())
        });
    }
    this.termoBuscaChanged.next(evt.value);
  }

    constructor(
      private eventoService: EventoService,
      private modalService: BsModalService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private router: Router
    ){}

    public ngOnInit(): void {
      this.pagination = {
        currentPage: 1,
        itemsPerPage: 3,
        totalItems: 1,
      } as Pagination;

      this.carregarEventos();
    }

  public alterarImagem(): void{
    this.exibirImage = !this.exibirImage;
  }

  public mostrarImagem(imagemURL: string): string{
    return imagemURL != '' && imagemURL != null
    ? `${environment.apiURL}resources/images/${imagemURL}`
    : 'assets/img/semImagem.jpeg';
  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result!;
          this.pagination = paginatedResult.pagination!;
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
        }
      ).add(() => this.spinner.hide());
  }

  abrirModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, this.config);
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }

  confirmar(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (retorno: any) => {
          if(retorno.result){
            this.spinner.hide();
            this.toastr.success('O evento foi excluído com sucesso!', 'Sucesso!');
            this.carregarEventos();
          }
      },
      error: (error: any) => {
        console.error(error);
        this.spinner.hide();
        this.toastr.error(`Erro ao tentar excluir o evento ${this.eventoId}`, 'Erro');
      },
      complete: () => {this.spinner.hide();},
    });

  }

  abortar(): void {
    this.modalRef?.hide();
    this.toastr.info('Nenhuma ação foi executada!', 'Informação!');
  }

  detalheEvento(id: number): void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
