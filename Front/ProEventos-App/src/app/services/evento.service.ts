import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, take } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {
  baseURL = environment.apiURL + 'api/eventos';
  tokenHeader = new HttpHeaders({'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI2YWVlNWJlMS1kOTJhLTQxNDktOTk3Zi00ZjA1MGMyZDY0ZmMiLCJ1bmlxdWVfbmFtZSI6ImVyaWMiLCJuYmYiOjE2ODA0NjE2ODksImV4cCI6MTY4MDU0ODA4OSwiaWF0IjoxNjgwNDYxNjg5fQ.-7zl8j5IsKcUZ3Oy3dchBovfNLBTihSqtomyAueEYK_xrwWjwrVmb0SjmeNHdV42hzMCstgMoM0PxmxQq0-tew'});

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]>{
    return this.http
                .get<Evento[]>(this.baseURL, { headers: this.tokenHeader })
                .pipe(take(1));
  }

  public getEventosByTema(tema: string): Observable<Evento[]>{
    return this.http
                .get<Evento[]>(`${this.baseURL}/tema/${tema}`)
                .pipe(take(1));
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http
                .get<Evento>(`${this.baseURL}/${id}`)
                .pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http
                .post<Evento>(this.baseURL, evento)
                .pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http
                .put<Evento>(`${this.baseURL}/${evento.id}`, evento)
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
                .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
                .pipe(take(1));
  }


}
