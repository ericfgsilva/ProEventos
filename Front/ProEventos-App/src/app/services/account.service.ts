import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/identity/User';
import { environment } from '@environments/environment';
import { map, Observable, ReplaySubject, take } from 'rxjs';

@Injectable()
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  baseUrl = environment.apiURL + 'api/account/'

  constructor(private http: HttpClient) { }

  public login(model: any): Observable<void>{
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user)
        }
      })
    );
  }

  public register(model: any): Observable<void>{
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user)
        }
      })
    );
  }

  logout(): void{
    this.clearCurrentUser();
  }

  public clearCurrentUser(): void{
    //localStorage.removeItem('user');
    const newLocal = {} as User;
    this.currentUserSource.next(newLocal);
    this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void{
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}
