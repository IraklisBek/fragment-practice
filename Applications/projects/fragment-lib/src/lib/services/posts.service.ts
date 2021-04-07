import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from "../environments/environment"
import { Comment, Post } from '../models/post.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private postUpdated = new Subject<Post>();
  private showPost: Subject<{ animationState: string, post: Post | null }> =
    new BehaviorSubject<{ animationState: string, post: Post | null }>({ animationState: "out", post: null });
  currentShowPost = this.showPost.asObservable();

  private scrollPositionFromPostView = new BehaviorSubject(0);
  currentScrollPositionFromPostView = this.scrollPositionFromPostView.asObservable();

  private viewPostClosed = new BehaviorSubject(true);
  currentViewPostClosed = this.viewPostClosed.asObservable();

  private getUserPosts = new BehaviorSubject("");
  currentGetUserPosts = this.getUserPosts.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http
      .get<{ message: string, posts: Post[], maxPosts: number }>(
        BACKEND_URL
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts.reverse()
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getAPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string | null) {
    return this.http.get<Post>(BACKEND_URL + id);
  }


  getPostByTags(tags: string) {
    return this.http.get<{ message: string, posts: Post[] }>(BACKEND_URL + "/tags/" + tags)
  }

  getPostByLocation(location: string) {
    return this.http.get<{ message: string, posts: Post[] }>(BACKEND_URL + "/location/" + location)
  }

  getPostByLocationAndTags(location: string, tags: string) {
    return this.http.get<{ message: string, posts: Post[] }>(BACKEND_URL + "/location_tags/" + location + "/" + tags)
  }

  addPost(user: string, kind: string, location: string, tags: string[], title: string, description: string, photo: File, photos: File[], videos: File[], music: File[]) {
    //const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append("user", user);
    postData.append("kind", kind);
    postData.append("location", location);
    postData.append("title", title);
    postData.append("description", description);
    postData.append("photo", photo, title);// name "image" should be equal with multer(storage).single("image") as in backend
    for (let i = 0; i < tags?.length; i++) {
      postData.append("tags", tags[i]);
    }
    for (let i = 0; i < photos?.length; i++) {
      postData.append("photos", photos[i], photos[i]['name']);
    }
    for (let i = 0; i < videos?.length; i++) {
      postData.append("videos", videos[i], videos[i]['name']);
    }
    for (let i = 0; i < music?.length; i++) {
      postData.append("music", music[i], music[i]['name']);
    }
    return this.http
      .post<{ message: string, post: Post }>(
        BACKEND_URL,
        postData
      )

  }

  updatePost(post: Post) {
    this.http.put(BACKEND_URL + post._id, post).subscribe(res => {
      this.postUpdated.next(post)
    })
  }

  updatePostComments(post: Post, comment: Comment) {
    this.http.put(BACKEND_URL + "comments/" + post._id, comment).subscribe(res => {
      post.comments.push(comment)
      this.postUpdated.next(post)
    })
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId)
  }


  public changeCurrentShowPost(show: { animationState: string, post: Post }) {
    this.showPost.next(show)
  }

  public changeCurrentScrollPositionFromPostView(scroll: number) {
    this.scrollPositionFromPostView.next(scroll)
  }

  public changeCurrentViewPostClosed(closed: boolean) {
    this.viewPostClosed.next(closed)
  }
  
  public changeGetUserPosts(userId: string) {
    this.getUserPosts.next(userId)
  }
}





// updatePost(id: string, user: string, kind: string, location: string, title: string, description: string, photo: File, photos: File[], videos: File[], music: File[]) {
//   let postData: Post | FormData;
//   // if (typeof (photo) === 'object') {
//   postData = new FormData();
//   postData.append("_id", id);
//   postData.append("user", user);
//   postData.append("kind", kind);
//   postData.append("location", location);
//   postData.append("title", title);
//   postData.append("description", description);
//   postData.append("photo", photo, title);// name "image" should be equal with multer(storage).single("image") as in backend
//   for (let i = 0; i < photos?.length; i++) {
//     postData.append("photos", photos[i], photos[i]['name']);
//   }
//   for (let i = 0; i < videos?.length; i++) {
//     postData.append("videos", videos[i], videos[i]['name']);
//   }
//   for (let i = 0; i < music?.length; i++) {
//     postData.append("music", music[i], music[i]['name']);
//   }
//   // } else {
//   //   postData = {
//   //     user: "",
//   //     kind: kind,
//   //     location: location,
//   //     photo: photo,
//   //     description: description,
//   //     title: title,
//   //     photos: photos,
//   //   };
//   // }
//   this.http
//     .put(BACKEND_URL + id, postData)
//     .subscribe((responseData) => {
//       this.router.navigate(["/"]);
//     })
// }
