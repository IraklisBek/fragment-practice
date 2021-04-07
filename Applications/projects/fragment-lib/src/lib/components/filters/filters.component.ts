import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlideInOutAnimation } from '../../helpers/animations';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'lib-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  animations: [SlideInOutAnimation]
})
export class FiltersComponent implements OnInit {
  @ViewChild("filtersArea") filtersArea: ElementRef | undefined;
  @ViewChild("darkBGArea") darkBGArea: ElementRef | undefined;
  isOpen: boolean = false;
  animationState = 'out';
  constructor(
    private eRef: ElementRef,
    private location: LocationStrategy,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router

  ) {
    this.location.onPopState(() => {
      var darkBGAreaEl = document.getElementById("darkBGFilters")
      if (darkBGAreaEl != null) {
        if (+window.getComputedStyle(darkBGAreaEl).opacity > 0) {
          this.cancelFilters()
          window.history.forward()
        }
      }
      return false;
    });
  }

  ngOnInit(): void {
  }

  switchOption(option: string) {
    if (option == "kind") {
      (<HTMLElement>document.getElementById("kindContent")).style.display = "block";
      (<HTMLElement>document.getElementById("filterContent")).style.display = "none";
      (<HTMLElement>document.getElementById("kindSectionBtn")).style.color = "var(--main-color)";
      (<HTMLElement>document.getElementById("kindSectionBtn")).style.backgroundColor = "white";
      (<HTMLElement>document.getElementById("filterSectionBtn")).style.color = "var(--my-black)";
      (<HTMLElement>document.getElementById("filterSectionBtn")).style.backgroundColor = "var(--my-grey)";
    } else {
      (<HTMLElement>document.getElementById("kindContent")).style.display = "none";
      (<HTMLElement>document.getElementById("filterContent")).style.display = "block";
      (<HTMLElement>document.getElementById("filterSectionBtn")).style.color = "var(--main-color)";
      (<HTMLElement>document.getElementById("filterSectionBtn")).style.backgroundColor = "white";
      (<HTMLElement>document.getElementById("kindSectionBtn")).style.color = "var(--my-black)";
      (<HTMLElement>document.getElementById("kindSectionBtn")).style.backgroundColor = "var(--my-grey)";
    }
  }

  addFiltersToParam(open: boolean){
    const urlTree = this.router.createUrlTree([], {
      queryParams: { filters: open},
      queryParamsHandling: "merge",
      preserveFragment: true });
  
    this.router.navigateByUrl(urlTree); 
  }

  openFilters() {

    (<HTMLElement>document.getElementById("bottomMenu")).style.display = "none";
    (<HTMLElement>document.getElementById("darkBGFilters")).style.opacity = "0.4";
    (<HTMLElement>document.getElementById("darkBGFilters")).style.maxHeight = "100vh";
    (<HTMLElement>document.getElementById("filterBtn")).style.display = "none";
    this.animationState = 'in';
    this.isOpen = true;
    this.generalService.changeCurrentBackButtonEnabled(false);
    this.generalService.forDummyPreventGoBack({filters: true});

  }

  applyFilters() {
    (<HTMLElement>document.getElementById("bottomMenu")).style.display = "flex";
    (<HTMLElement>document.getElementById("darkBGFilters")).style.opacity = "0";
    (<HTMLElement>document.getElementById("darkBGFilters")).style.maxHeight = "0";
    (<HTMLElement>document.getElementById("filterBtn")).style.display = "flex";
    this.animationState = 'out';
    this.isOpen = false;
    this.generalService.changeCurrentBackButtonEnabled(true);
    this.generalService.forDummyPreventGoBack({filters: false});
  }

  cancelFilters() {
    (<HTMLElement>document.getElementById("bottomMenu")).style.display = "flex";
    (<HTMLElement>document.getElementById("darkBGFilters")).style.opacity = "0";
    (<HTMLElement>document.getElementById("darkBGFilters")).style.maxHeight = "0";
    (<HTMLElement>document.getElementById("filterBtn")).style.display = "flex";
    this.animationState = 'out';
    this.isOpen = false;
    this.generalService.changeCurrentBackButtonEnabled(true);
    this.generalService.forDummyPreventGoBack({filters: false});
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.darkBGArea?.nativeElement.contains(event.target)) {
      this.cancelFilters();
    }
  }
}

//    this.animationState = this.animationState === 'out' ? 'in' : 'out';

