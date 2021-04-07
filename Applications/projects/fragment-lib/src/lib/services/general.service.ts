import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private backButtonEnabled = new BehaviorSubject<boolean>(true);
  currentBackButtonEnabled = this.backButtonEnabled.asObservable();

  constructor(
    private router: Router,
  ) { }

  tagsFromArrayToJson(tags: any){
    var newArray = new Array();
    for(let i=0; i< tags.length; i++){
      newArray[i] = {}
      newArray[i]['name'] = tags[i]
    }
    var json = JSON.stringify(newArray);
    return json;
  }

  changeCurrentBackButtonEnabled(goBack: boolean){
    console.log(goBack)
    this.backButtonEnabled.next(goBack);
  }

  //Need query params, check canDeactivate Guard
  forDummyPreventGoBack(params: any){
    const urlTree = this.router.createUrlTree([], {
      queryParams: params,
      queryParamsHandling: "merge",
      preserveFragment: true });
  
    this.router.navigateByUrl(urlTree); 
  }

}
