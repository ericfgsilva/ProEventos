import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  constructor(private router: Router) { /* TODO document why this constructor is empty */  }

  ngOnInit() {
    // TODO document why this method 'ngOnInit' is empty

  }

  showMenu(): boolean {
    return this.router.url != '/user/login';
  }

}
