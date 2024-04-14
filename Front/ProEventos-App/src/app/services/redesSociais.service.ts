import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { Observable, take } from 'rxjs';

@Injectable()
export class RedesSociaisService {

  baseURL = 'https://localhost:5001/api/redesSociais';

  constructor(private http: HttpClient) { }

  public getRedesSociaisByEventoId(eventoId: number): Observable<RedeSocial[]>{
    return this.http
                .get<RedeSocial[]>(`${this.baseURL}/${eventoId}`)
                .pipe(take(1));
  }

  public getRedeSocial(eventoId: number, redeSocialId: number): Observable<RedeSocial>{
    return this.http
                .get<RedeSocial>(`${this.baseURL}/${eventoId}/${redeSocialId}`)
                .pipe(take(1));
  }

  public saveRedesSociais(eventoId: number, redesSociais: RedeSocial[]): Observable<RedeSocial[]>{
    return this.http
                .put<RedeSocial[]>(`${this.baseURL}/${eventoId}`, redesSociais)
                .pipe(take(1));
  }

  public deleteRedeSocial(eventoId: number, redeSocialId: number): Observable<any>{
    return this.http
                .delete(`${this.baseURL}/${eventoId}/${redeSocialId}`)
                .pipe(take(1));
  }
}
