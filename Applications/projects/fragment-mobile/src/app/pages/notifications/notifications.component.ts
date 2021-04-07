import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'projects/fragment-lib/src/public-api';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  user?: User;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUserLocal();
    console.log(this.user)
  }

}
