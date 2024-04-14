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

  /**
   *
   * @param origem Informar a palavra 'palestrante' ou 'evento' para buscar na rota específica
   * @param id Informar PalestranteId ou EventoId, dependendo da origem informada
   * @param redesSociais Informar um array de objetos RedeSocial
   * @returns Observable<RedeSocial[]>
   */
  public saveRedesSociais(origem: string, id: number, redesSociais: RedeSocial[]): Observable<RedeSocial[]>{
    let URL =
      id == 0
        ? `${this.baseURL}/${origem.toLowerCase()}`
        : `${this.baseURL}/${origem.toLowerCase()}/${id}`;

    return this.http
                .put<RedeSocial[]>(URL, redesSociais)
                .pipe(take(1));
  }

  /**
   *
   * @param origem Informar a palavra 'palestrante' ou 'evento' para buscar na rota específica
   * @param id Informar PalestranteId ou EventoId, dependendo da origem informada
   * @param redeSocialId Informar o ID de objetos RedeSocial
   * @returns Observable<any> - Pois é o retorno da rota
   */
  public deleteRedeSocial(origem: string, id: number, redeSocialId: number): Observable<any>{
    let URL =
      id == 0
        ? `${this.baseURL}/${origem.toLowerCase()}/${redeSocialId}`
        : `${this.baseURL}/${origem.toLowerCase()}/${id}/${redeSocialId}`;

    return this.http
                .delete(URL)
                .pipe(take(1));
  }

  /**
   *
   * @param origem Informar a palavra 'palestrante' ou 'evento' para buscar na rota específica
   * @param id Informar PalestranteId ou EventoId, dependendo da origem informada
   * @param redeSocialId Informar o ID de objetos RedeSocial
   * @returns Observable<RedeSocial>
   */
  public getRedeSocial(origem: string, id: number, redeSocialId: number): Observable<RedeSocial>{
    let URL =
      id == 0
        ? `${this.baseURL}/${origem.toLowerCase()}/${redeSocialId}`
        : `${this.baseURL}/${origem.toLowerCase()}/${id}/${redeSocialId}`;

    return this.http
                .get<RedeSocial>(URL)
                .pipe(take(1));
  }
}
