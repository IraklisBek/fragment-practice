import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Tag } from '../models/tag.model';

const BACKEND_URL = environment.apiUrl + "/tags/";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private http: HttpClient
  ) { }

  addTag(name: string) {
    var tag = {
      name: name
    }
    return this.http.post<{ tag: Tag }>(BACKEND_URL, tag)
  }

  getTagByName(name: string) {
    return this.http.get<Tag>(BACKEND_URL + name)
  }

  deleteTag(id: string) {
    return this.http.delete<{ tag: Tag }>(BACKEND_URL + id)
  }

  deleteTagByName(name: string) {
    return this.http.delete<Tag>(BACKEND_URL + "name/" + name)
  }
}
