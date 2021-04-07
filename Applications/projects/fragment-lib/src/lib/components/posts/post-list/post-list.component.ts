import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../../models/post.model';
import { AuthService } from '../../../services/auth.service';
import { GeneralService } from '../../../services/general.service';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'lib-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() showFilters?: boolean;
  // @Input() showPostOfUserId?: string;
  // @Input() showMsg?:boolean;
  //@Input() posts: Post[] = [];
  userIsAuthenticated = false;
  userId?: string;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 4, 5, 10];
  private postsSub?: Subscription;
  private authStatusSub?: Subscription;
  top: number = 0;
  postLocation: string | null = null;
  postTags: string | null = null;
  postTagsJson: any | null = null;
  thePosts: Post[] = []

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((query: any) => {
      this.getPosts(query.params.userId);
    });
    this.isLoading = true;
    this.userId = this.authService.getUserId()!;


    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId()!;
      });
  }

  async getPosts(userId?: string) {
    this.postLocation = this.activatedRoute.snapshot.queryParamMap.get('location');
    this.postTags = this.activatedRoute.snapshot.queryParamMap.get('tags');
    if (this.postTags) {
      this.postTagsJson = JSON.parse(this.postTags);
    }
    if (this.postLocation != null && this.postTags != null) {
      this.postsService.getPostByLocationAndTags(this.postLocation!, this.postTags!).subscribe(res => {
        this.posts = res.posts.reverse()
      })
    } else if (this.postLocation != null && this.postTags == null) {
      this.postsService.getPostByLocation(this.postLocation!).subscribe(res => {
        this.posts = res.posts.reverse()
      })
    } else if (this.postLocation == null && this.postTags != null) {
      this.postsService.getPostByTags(this.postTags!).subscribe(res => {
        this.posts = res.posts.reverse()
      })
    } else {
      this.postsService.getPosts();
      this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((postData: { posts: Post[], postCount: number }) => {
          this.isLoading = false;
          this.totalPosts = postData.postCount;
          this.posts = this.getUserPost(postData.posts, userId!);
          this.scrollTo();
        });
    }
  }

  scrollTo(){
    setTimeout(()=>{
      this.postsService.currentScrollPositionFromPostView.subscribe(res => {
        window.scrollTo(0, res)
      })
    }, 1)

  }

  getUserPost(thePosts: Post[], userId: string) {
    var posts = []
    if (userId != undefined) {
      for (let post of thePosts) {
        if (post.user._id == userId) {
          posts.push(post)
        }
      }
    } else {
      posts = thePosts;
    }
    return posts;
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts();
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts();
    }, error => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub?.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }

  openProject(post: Post) {
    setTimeout(() => {
      (<HTMLElement>document.getElementById("postList")).style.display = "none";
    }, 600)
    this.postsService.changeCurrentScrollPositionFromPostView(this.top)
    this.postsService.changeCurrentShowPost({ animationState: "in", post: post })
    this.generalService.forDummyPreventGoBack({ view: true });

    // this.postsService.changeCurrentScrollPositionFromPostView(this.top)
    // this.router.navigate(["/post/" + post._id])
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll(e: any) {
    // console.log(e.target['scrollingElement'].scrollTop)
    this.top = e.target['scrollingElement'].scrollTop
    // Your Code Here

  }
}
