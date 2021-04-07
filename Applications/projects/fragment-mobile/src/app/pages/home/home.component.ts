import { Component, OnInit } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { GeneralService } from '@fragment-lib';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../../services/can-deactivate-guard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit { //, CanDeactivate<CanComponentDeactivate> {
  //go?: boolean
  constructor(
    //private generalService: GeneralService
  ) { }

  ngOnInit(): void {

  }

  // canDeactivate(): Observable<boolean> | boolean | Promise<boolean> {
  //   this.generalService.currentBackButtonEnabled.subscribe(res => {
  //     console.log(res); //ALWAYS TRUE
  //   });
  //   return true;
  // }

  // canDeactivate(): Observable<boolean> | boolean | Promise<boolean> {
  //   this.generalService.currentBackButtonEnabled.subscribe(res => {
  //     console.log(res); //ALWAYS TRUE
  //   });
  //   return this.generalService.currentBackButtonEnabled;
  // }
}
