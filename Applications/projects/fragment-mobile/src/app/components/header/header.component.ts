import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '@fragment-lib';
import { User } from '@fragment-lib';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  user?: User;
  private authListenerSubs?: Subscription
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    console.log(this.user)
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe((isAuthenticated: any) => {
      this.userIsAuthenticated = isAuthenticated;
      this.user = this.authService.getUser();
    });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs?.unsubscribe();
  }
}
