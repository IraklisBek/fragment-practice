import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GeneralService } from '@fragment-lib';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private generalService: GeneralService) {

  }
  canDeactivate(component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (
      (
        route.queryParams.filters == true ||
        route.queryParams.create == true ||
        route.queryParams.view == true ||
        route.queryParams.supporting == true 
      )
    ) {
      return false
    }

    return true;
  }

}

// import { Injectable } from "@angular/core";
// import {
//   ActivatedRouteSnapshot,
//   CanDeactivate,
//   RouterStateSnapshot
// } from "@angular/router";
// import { Observable } from "rxjs";

// export interface CanComponentDeactivate {
//   canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
// }

// @Injectable({
//   providedIn: "root"
// })
// export class CanDeactivateGuard
//   implements CanDeactivate<CanComponentDeactivate> {
//   canDeactivate(
//     component: CanComponentDeactivate,
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ) {
//     return component.canDeactivate ? component.canDeactivate() : true;
//   }
// }