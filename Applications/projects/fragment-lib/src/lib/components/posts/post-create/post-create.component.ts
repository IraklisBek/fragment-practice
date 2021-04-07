import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { PostsService } from '../../../services/posts.service';
import { Post } from '../../../models/post.model';
import { SlideInOutAnimation } from '../../../helpers/animations';
import { DatePickerComponent, DatePickerDirective } from 'ng2-date-picker';
import { ToastrService } from 'ngx-toastr';
import { find, get, pull } from 'lodash';
import { TagService } from '../../../services/tag.service';
import { User } from '../../../models/user.model';
import { DOCUMENT } from '@angular/common';
import { GeneralService } from '../../../services/general.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'lib-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
  animations: [SlideInOutAnimation]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  animationState: string = 'out';
  titleError = ""
  contentError = ""
  isLoading = false;
  form: FormGroup = new FormGroup({});
  imagePreview?: string;
  photosPreview: string[] = [];
  videosPreview: string[] = [];
  videosFiles: File[] = [];
  mp3sPreview: string[] = [];
  mp3sFiles: File[] = [];
  kind: string = "";
  private authStatusSub?: Subscription;
  formattedaddress = " ";
  @ViewChild('tagInput') tagInputRef?: ElementRef;
  tags: string[] = [];
  tagIDs: string[] = [];
  user?: User

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
    private tagService: TagService,
    private generalService: GeneralService,
    private router: Router,
    private usersService: UserService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: any) => {
      this.isLoading = false;
    });
    this.user = this.authService.getUser();
    this.form = new FormGroup({
      location: new FormControl(null, {
        validators: [Validators.required]
      }),
      photo: new FormControl(null, {
        validators: [Validators.required]
      }),
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      description: new FormControl(null),
      photos: new FormControl(null),
      videos: new FormControl(null),
      music: new FormControl(null),
      tag: new FormControl(null)
    });

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({
      photo: file
    });//patch a single control, file is not text, is an object
    this.form.get('photo')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {//async code, will take a while
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    (<HTMLImageElement>document.getElementById("pictureIcon")).src = "../../assets/icons/picture-pink.png";
  }

  deleteFile(src: string) {
    this.imagePreview = ''
  }

  onPhotosPicked(event: any) {
    if (event.target!.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.photosPreview?.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      this.form.patchValue({
        photos: event.target!.files
      });
      this.onFilesSelected(event.target!.files, "photosCreateIcon", "../../assets/icons/photos-pink.png")
    }
  }

  deletePhoto(src: string) {
    const index = this.photosPreview.indexOf(src, 0);
    if (index > -1) {
      this.photosPreview.splice(index, 1);
    }
  }

  onVideosPicked(event: any) {
    if (event.target!.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.videosPreview?.push(event.target.result);
        }
        this.videosFiles.push(event.target.files[i]);

        reader.readAsDataURL(event.target.files[i]);
      }
      this.form.patchValue({
        videos: event.target!.files
      });
      this.onFilesSelected(event.target!.files, "videosCreateIcon", "../../assets/icons/videos-pink.png")
    }
  }

  onMp3sPicked(event: any) {
    if (event.target!.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.mp3sPreview?.push(event.target.result);
        }
        this.mp3sFiles.push(event.target.files[i]);

        reader.readAsDataURL(event.target.files[i]);
      }
      this.form.patchValue({
        music: event.target!.files
      });
      this.onFilesSelected(event.target!.files, "musicCreateIcon", "../../assets/icons/music-pink.png")
    }
  }

  async onSavePost() {
    if (this.form?.invalid) {
      return;
    }
    var location = (<HTMLInputElement>document.getElementById("map")).value;


    this.isLoading = true;
    this.postsService.addPost(
      this.authService.getUser()._id,
      this.kind,
      location,
      this.tagIDs,
      this.form?.value.title,
      this.form?.value.description,
      this.form?.value.photo,
      this.form?.value.photos,
      this.form?.value.videos,
      this.form?.value.music,
    ).subscribe(async (responseData) => {
      this.user?.posts.push(responseData.post);
      await this.usersService.updateUser(this.user!)
      this.router.navigate(["/"]);
    });
    this.toastrService.success("Your post has been published")
    // if (!this.getTitleErrorMsg() && !this.getContentErrorMsg()) {
    //   this.form.reset();
    // }
  }

  getTitleErrorMsg() {
    var postTitle = this.form?.value.title;
    if (postTitle != null) {
      if (postTitle.length == 0) {
        return "Please enter a post title"
      }
      if (postTitle.length > 0 && postTitle.length < 3) {
        return "Post title must be greater than 3 characters"
      }
    }
    return null
  }

  getContentErrorMsg() {
    var postContent = this.form?.value.content;
    if (postContent != null) {
      if (postContent.length == 0) {
        return "Please enter a post title"
      }
      if (postContent.length > 0 && postContent.length < 10) {
        return "Post title must be greater than 10 characters"
      }
    }
    return null
  }

  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }

  openProject() {
    this.kind = "project"
    this.animationState = "in"
    console.log(this.kind)
    this.generalService.forDummyPreventGoBack({ create: true });
  }

  closeProject() {
    this.animationState = "out"
    this.generalService.forDummyPreventGoBack({ create: false });
  }

  inputChanged(event: any, id: string, src: string, tags?: boolean) {
    if (event.value?.length > 0) {
      (<HTMLImageElement>document.getElementById(id)).src = src;
    } else {
      (<HTMLImageElement>document.getElementById(id)).src = src.replace("-pink", "");
    }
    if (tags) {
      const inputValue: string = this.form?.controls.tag.value;
      if (event.data.indexOf(" ") >= 0) {
        this.addTag(inputValue);
        this.form?.controls.tag.setValue('');
      }
    }
  }

  onFilesSelected(files: any, id: string, src: string) {
    if (files.length > 0) {
      (<HTMLImageElement>document.getElementById(id)).src = src;
    } else {
      (<HTMLImageElement>document.getElementById(id)).src = src.replace("-pink", "");
    }
  }

  public AddressChange(address: any) {
    //setting address from API to local variable 
    this.formattedaddress = address.formatted_address
  }


  focusTagInput(): void {
    this.tagInputRef?.nativeElement.focus();
  }

  addTag(tag: string): void {
    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    if (tag.length > 0 && !find(this.tags, tag)) {
      this.tags.push(tag);
      this.tagService.addTag(tag).subscribe(res => {
        this.tagIDs.push(res.tag._id)
      })
    }
  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }
    this.tagService.deleteTagByName(tag!).subscribe(res => {
      console.log(res);
    })
    if (this.tags.length == 0) {
      (<HTMLImageElement>document.getElementById("tagCreateIcon")).src = "../../assets/icons/tag.png";
    }
  }

  @HostListener('window:popstate', ['$event'])
  onpopstate(event: any) {
    this.closeProject();
  }

}
// this.route.paramMap.subscribe((paramMap: ParamMap) => {
  // if (paramMap.has('postId')) {
  //   this.node = 'edit';
  //   this.postId = paramMap.get('postId')!;
  //   this.isLoading = true;
  //   this.postsService.getPost(this.postId).subscribe(postData => {
  //     this.isLoading = false;
  //     this.post = {
  //       _id: postData._id,
  //       user: postData.user,
  //       kind: postData.kind,
  //       location: postData.location,
  //       photo: postData.photo,
  //       description: postData.description,
  //       title: postData.title,
  //       photos: postData.photos,
  //       videos: postData.videos,
  //       music: postData.music,
  //     };
  //     this.form?.setValue({
  //       location: this.post?.location,
  //       photo: this.post?.photo,
  //       title: this.post?.title,
  //       description: this.post?.description,
  //       photos: this.post?.photos,
  //       videos: this.post?.videos,
  //       music: this.post?.music,
  //     });
  //   });
  // } else {
      // }
    // });

    // } else {
    //   this.postsService.updatePost(
    //     this.postId!,
    //     "551137c2f9e1fac808a5f572",
    //     "project",
    //     this.form?.value.location,
    //     this.form?.value.title,
    //     this.form?.value.description,
    //     this.form?.value.photo,
    //     this.form?.value.photos,
    //     this.form?.value.videos,
    //     this.form?.value.music,
    //   );
    // }
    // if (!this.getTitleErrorMsg() && !this.getContentErrorMsg()) {
    //   this.form?.reset();
    // }
