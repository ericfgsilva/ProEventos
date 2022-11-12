import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  constructor() { /* TODO document why this constructor is empty */  }

  ngOnInit() {
    // TODO document why this method 'ngOnInit' is empty

  }

}
