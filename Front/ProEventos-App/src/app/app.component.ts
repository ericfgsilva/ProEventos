import { Component } from '@angular/core';
import { AccountService } from './services/account.service';
import { User } from './models/identity/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'ProEventos-App';
  tituloPagina = 'ProEvento';

  constructor(public accountService: AccountService){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    let user: User;

    if(localStorage.getItem('user'))
      user = JSON.parse(localStorage.getItem('user') ?? '{}');
    else
      user = {} as User


    if(user)
      this.accountService.setCurrentUser(user);
  }

}
