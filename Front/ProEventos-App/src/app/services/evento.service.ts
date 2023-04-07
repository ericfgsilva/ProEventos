import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, take } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {
  baseURL = environment.apiURL + 'api/eventos';

  user = localStorage.getItem('user');
  tokenHeader = new HttpHeaders({
    'Authorization': this.user !== null ? `Bearer ${JSON.parse(this.user).token}` : ''
  });

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]>{
    return this.http
                .get<Evento[]>(this.baseURL, { headers: this.tokenHeader })
                .pipe(take(1));
  }

  public getEventosByTema(tema: string): Observable<Evento[]>{
    return this.http
                .get<Evento[]>(`${this.baseURL}/tema/${tema}`, { headers: this.tokenHeader })
                .pipe(take(1));
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http
                .get<Evento>(`${this.baseURL}/${id}`, { headers: this.tokenHeader })
                .pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http
                .post<Evento>(this.baseURL, evento)
                .pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http
                .put<Evento>(`${this.baseURL}/${evento.id}`, evento, { headers: this.tokenHeader })
                .pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http
                .delete(`${this.baseURL}/${id}`)
                .pipe(take(1));
  }

  postUpload(eventoId: number, file: File): Observable<Evento>{
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
                .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData, { headers: this.tokenHeader })
                .pipe(take(1));
  }


}
