import { Component, OnInit } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {

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

  constructor(private eventoService: EventoService){}

  public ngOnInit(): void {
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
      error: (error: any) => console.log(error)
    }
    this.eventoService.getEventos().subscribe(observer);
  }

}
