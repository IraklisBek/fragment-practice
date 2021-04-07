import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SlideInOutAnimation, SlideFromLeftRightAnimation, inOutAnimation } from '../../../helpers/animations';
import { Post } from '../../../models/post.model';
import { PostsService } from '../../../services/posts.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Tag } from '../../../models/tag.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'lib-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  animations: [SlideInOutAnimation, SlideFromLeftRightAnimation, inOutAnimation]
})
export class PostViewComponent implements OnInit {
  animationState: string = 'out';
  post?: Post;
  showAllDescr: boolean = false;
  galleryIndexFirst?: number;
  imgHeight?: number;
  constructor(
    private postsService: PostsService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    // var postId = this.route.snapshot.paramMap.get("postId")
    // this.postsService.getPost(postId).subscribe(res => {
    //   this.post = res
    //   this.animationState = "in"
    // })


    this.postsService.currentShowPost.subscribe(res => {
      this.animationState = res.animationState;
      this.post = res.post!;
      if (this.animationState == "in") {
        setTimeout(() => {
          (<HTMLElement>document.getElementById("postView")).style.position = "absolute"
          window.scrollTo(0, 0);
        }, 600)
      }
    })
    this.imgHeight = window.innerWidth * 0.48;
  }

  closeProject() {
    (<HTMLElement>document.getElementById("postList")).style.display = "block";
    (<HTMLElement>document.getElementById("postView")).style.position = "fixed"
    this.postsService.changeCurrentViewPostClosed(true);
    this.postsService.changeCurrentShowPost({ animationState: "out", post: this.post! });
    this.generalService.forDummyPreventGoBack({ view: false });


    // this.postsService.changeCurrentViewPostClosed(true);
    // this.location.back()
  }

  readMore() {
    this.showAllDescr = !this.showAllDescr
  }

  openGallery(index: number) {
    this.galleryIndexFirst = index;
    (<HTMLElement>document.getElementById("gallery")).style.display = "block";
    var photos = this.post!.photos
    for (let i = 0; i < photos.length; i++) {
      if (i == index) {
        (<HTMLImageElement>document.getElementById("galleryImg")).src = photos[i];
      }
    }
  }

  nextPhoto() {
    if (this.galleryIndexFirst == this.post!.photos.length - 1) {
      this.galleryIndexFirst = 0;
    } else {
      this.galleryIndexFirst = this.galleryIndexFirst! + 1;
    }
    (<HTMLImageElement>document.getElementById("galleryImg")).src = this.post!.photos[this.galleryIndexFirst];
  }

  previousPhoto() {
    if (this.galleryIndexFirst == 0) {
      this.galleryIndexFirst = this.post!.photos.length - 1;
    } else {
      this.galleryIndexFirst = this.galleryIndexFirst! - 1;
    }
    (<HTMLImageElement>document.getElementById("galleryImg")).src = this.post!.photos[this.galleryIndexFirst];
  }

  closeGallery() {
    (<HTMLElement>document.getElementById("gallery")).style.display = "none";
  }

  postDesriptionWithTags(post: Post, slice: boolean, sliceNum: number) {
    var tagsUnited: string = '<br><span class="color-pink-bold">';
    for (let tag of post.tags) {
      tagsUnited += "<span (click)='viewPostWithTagName(tag)'>#" + tag.name + "</span> "
    }
    tagsUnited += "</span>";
    var together = post.description + " " + tagsUnited;
    if (slice) {
      together = together.slice(0, sliceNum);
    }
    return this.sanitizer.bypassSecurityTrustHtml(together);
  }

  getLengthOfDescriptionAndTags(post: Post) {
    var tagsUnited: string = '';
    for (let tag of post.tags) {
      tagsUnited += "#" + tag.name + " "
    }
    return (post.description + tagsUnited).length;
  }
  viewPostsWithTagName(tag: Tag) {
    var tagsToSend = new Array();
    tagsToSend[0] = {}
    tagsToSend[0]['name'] = tag.name
    var json = JSON.stringify(tagsToSend);
    this.closeProject();
    this.router.navigate(["/home"], { queryParams: { tags: json } })
  }

  viewPostsAtLocation(location: string) {
    this.closeProject();
    this.router.navigate(["/home"], { queryParams: { location: location } })
  }

  @HostListener('window:popstate', ['$event'])
  onpopstate(event: any) {
    this.closeProject();
  }

  getTitleFromMediaElement(el: string) {
    var n1 = el.lastIndexOf("/")
    var n2 = el.lastIndexOf("-")
    var newEl = el.slice(n1 + 1, n2 - 4);//-4 for .mp3
    return newEl;
  }

  goToProfile(userId: string) {
    this.closeProject();
    this.router.navigate(["/profile"], { queryParams: { userId: userId } })

  }
}
