import { Component, OnInit } from '@angular/core';
import { AuthService } from '@fragment-lib';

@Component({
  selector: 'app-burger',
  templateUrl: './burger.component.html',
  styleUrls: ['./burger.component.scss']
})
export class BurgerComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.authService.logout();
  }
}
