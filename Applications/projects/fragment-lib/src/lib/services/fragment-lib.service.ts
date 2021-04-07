import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FragmentLibService {

  constructor() { }

  get testing(): string {
    return "FragmentLibService works!";
  }
}
