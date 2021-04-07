import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { find, get, pull } from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('tagInput') tagInputRef?: ElementRef;
  tags: string[] = [];
  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      tag: [undefined],
      location: null
    });
  }

  formattedaddress = " ";
  public AddressChange(address: any) {
    //setting address from API to local variable 
    this.formattedaddress = address.formatted_address
  }


  focusTagInput(): void {
    this.tagInputRef?.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue: string = this.form?.controls.tag.value;
    console.log(event.key)
    console.log(event)
    // if (event.code === 'Backspace' && !inputValue) {
    //   this.removeTag();
    //   return;
    // } else {
    if (event.code === 'Comma' || event.code === 'Space' || event.key == "32" || inputValue == " " || event.keyCode == 32) {
      this.addTag(inputValue);
      this.form?.controls.tag.setValue('');
    }
    // }
  }

  inpute(event: any) {
    const inputValue: string = this.form?.controls.tag.value;
    if (event.data.indexOf(" ") >= 0) {
      this.addTag(inputValue);
      this.form?.controls.tag.setValue('');
    }
  }

  addTag(tag: string): void {
    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    if (tag.length > 0 && !find(this.tags, tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }
  }

  explore() {
    var location = (<HTMLInputElement>document.getElementById("searchLocation")).value;
    console.log(this.tags)
    console.log(JSON.stringify(this.tags))
    var tagsToSend = new Array();
    for (let i = 0; i < this.tags.length; i++) {
      tagsToSend[i] = {}
      tagsToSend[i]['name'] = this.tags[i]
    }
    var json = JSON.stringify(tagsToSend);
    var params;
    if (location == "" && tagsToSend.length > 0) {
      params = {
        queryParams: { tags: json }
      }
    }
    else if (location != "" && tagsToSend.length == 0) {
      params = {
        queryParams: { location: location }
      }
    } else if (location == "" && tagsToSend.length == 0) {
      params = {
        queryParams: {}
      }
    } else {
      params = {
        queryParams: { location: location, tags: json }
      }
    }
    this.router.navigate(["/home"], params)
  }
}
