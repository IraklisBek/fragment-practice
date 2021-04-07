import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { environment } from '../environments/environment';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { PostsService } from './posts.service';

const BACKEND_URL = environment.apiUrl + "/users/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private postsService: PostsService
  ) { }

  getUser(userId: string) {
    return this.http.get<User>(BACKEND_URL + userId).toPromise()
  }

  updateUser(user: User) {
    return this.http.put<{ message: string, user: User }>(BACKEND_URL + user._id, user).toPromise()
  }

  getUsersLikedAPost(postID?: string) {
    return this.http.get<{ message: string, users: User[] }>(BACKEND_URL + "liked_by_users/" + postID);
  }

  checkIfUserHasNotification(postId: string, kind: string) {
    const user = this.authService.getUser();
    for (let notification of user.notifications) {
      if (notification.post._id == postId && notification.kind == kind) {
        return true;
      }
    }
    return false;
  }
}
