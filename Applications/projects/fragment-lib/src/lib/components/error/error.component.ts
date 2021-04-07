import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SlideInOutAnimation } from '../../helpers/animations';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  animations: [SlideInOutAnimation]
})
export class ErrorComponent implements OnInit {
  animationState: string = "out";
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) { }

  ngOnInit() {
    this.animationState = "in";
  }

  okay(){
    this.animationState = "out";
  }

}
