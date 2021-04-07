import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService, FragmentLibService, slideInAnimation } from '@fragment-lib';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { PostsService } from '@fragment-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit {
  title = 'fragment-mobile';
  route: string = ""
  @ViewChild("mainContent")
  private mainContentDiv!: ElementRef<HTMLElement>;
  userIsAuthenticated = false;
  private authListenerSubs?: Subscription
  constructor(
    private engineService: FragmentLibService,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private postsService: PostsService
  ) {
    console.info(engineService.testing);
    this.router.events.subscribe(val => {
      this.route = this.location.path();
    })
  }
  ngOnInit() {
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.userIsAuthenticated = isAuthenticated;
        if (!this.userIsAuthenticated) {
          this.router.navigate(["/login"])
        }
      });
  }
  ngOnDestroy() {
    this.authListenerSubs?.unsubscribe();
  }
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    this.authService.autoAuthUser();
  }
}
