import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { environment } from '@environments/environment';
import { Observable, take } from 'rxjs';

@Injectable()
export class RedeSocialService {

  baseURL = environment.apiURL + 'api/redesSociais';

  constructor(private http: HttpClient) { }

  /**
   *
   * @param origem Informar a palavra 'palestrante' ou 'evento' para buscar na rota específica
   * @param id Informar PalestranteId ou EventoId, dependendo da origem informada
   * @returns Observable<RedeSocial[]>
   */
  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]>{
    let URL =
      id == 0
        ? `${this.baseURL}/${origem.toLowerCase()}`
        : `${this.baseURL}/${origem.toLowerCase()}/${id}`;

    return this.http
                .get<RedeSocial[]>(URL)
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
