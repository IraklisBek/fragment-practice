import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SlideInOutAnimation } from '../../../helpers/animations';
import { Notification } from '../../../models/notification.model';
import { Post } from '../../../models/post.model';
import { Comment } from '../../../models/post.model';
import { SupportedBy } from '../../../models/post.model';
import { Support } from '../../../models/user.model';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { GeneralService } from '../../../services/general.service';
import { NotificationsService } from '../../../services/notifications.service';
import { PostsService } from '../../../services/posts.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'lib-post-like',
  templateUrl: './post-like.component.html',
  styleUrls: ['./post-like.component.scss'],
  animations: [SlideInOutAnimation]
})
export class PostLikeComponent implements OnInit {
  @Input() post?: Post
  @ViewChild("comments") commentsArea?: ElementRef
  @ViewChild("supportModal") supportModal?: ElementRef
  @ViewChild("darkBGArea") darkBGArea: ElementRef | undefined;
  @ViewChild("commentInput") commentInputArea: ElementRef | undefined;

  user?: User
  postLikes?: User[];
  postSupport?: SupportedBy[];
  postComments?: Comment[];
  userPostedByNotifications?: Notification[];
  comments: boolean = false;
  form: FormGroup = new FormGroup({});
  formSupport: FormGroup = new FormGroup({});
  animationState: string = "out";
  end: number = 2;
  showLoadBtn: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postsService: PostsService,
    private generalService: GeneralService,
    private notificationService: NotificationsService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.postLikes = this.post?.likedBy;
    this.postSupport = this.post?.supportedBy;
    this.postComments = this.post?.comments;
    this.userPostedByNotifications = this.post?.user.notifications;

    this.form = new FormGroup({
      commentInput: new FormControl(null, {
      })
    });
    this.formSupport = new FormGroup({
      payInput: new FormControl(null, {
      }),
      supportMessageInput: new FormControl(null, {
      })
    });
  }

  async onLike() {
    let notification: Notification;
    const likedByUser = this.likedByUser() ? true : false
    await this.notificationService.getNotificationByPostAndKind(this.post?._id!, "LIKE").then(res => {
      notification = res;
    })
    if (notification!._id! != undefined) {
      let users = notification!.users_involved
      if(likedByUser){
        users.push(this.user!)
        users = users.filter(el => el._id !== this.user?._id);
      }else{
        users.push(this.user!)
      }
      
      notification = {
        _id: notification!._id,
        title: notification!.users_involved.length + " people liked " + this.post?.title,
        kind: "LIKE",
        post: this.post!,
        users_involved: users,
        read: false,
      }
      console.log(notification)
      if(users.length>0){
        await this.notificationService.updateNotification(notification).then()
      }else{
        await this.notificationService.deleteNotification(notification, this.post?.user._id!).then()
      }
    } else {
      notification = {
        title: this.user?.username + " liked " + this.post?.title,
        kind: "LIKE",
        post: this.post!,
        users_involved: [this.user!],
        read: false,
      }
      await this.notificationService.addNotification(notification).then((res: Notification)=>{
        notification = res
      });
      let userPostedBy: User;
      await this.userService.getUser(this.post?.user._id!).then(res=>{
        userPostedBy = res
        userPostedBy.notifications.push(notification)
      })
      await this.userService.updateUser(userPostedBy!).then(res=>{
        this.post!.user = res.user
      })
    }
    
    if (!likedByUser) {
      this.user?.likes.push(this.post!)
    } else {
      this.user!.likes = this.user!.likes.filter(el => el._id !== this.post?._id);
    }
    await this.userService.updateUser(this.user!).then(res => {
      this.authService.setUser(res.user)
      this.user = res.user
    })
    //AVOIDING JSON CIRCLE
    if (!likedByUser) {
      this.post?.likedBy.push(this.user!);
    } else {
      this.post!.likedBy = this.post!.likedBy.filter(el => el._id !== this.user?._id)
    }
    this.postLikes = this.post?.likedBy;
    this.postsService.updatePost(this.post!)
  }

  onSupport() {
    this.animationState = "in"
    this.darkBGArea!.nativeElement.style.opacity = "0.4";
    this.darkBGArea!.nativeElement.style.maxHeight = "100vh";
    this.generalService.changeCurrentBackButtonEnabled(false);
    // this.generalService.forDummyPreventGoBack({ supporting: true }); //??????????????? giati ginete i malakia tou?
  }

  async pay() {
    var pay = this.formSupport?.value.payInput;
    var comment = this.formSupport?.value.supportMessageInput; //WILL GO TO EMAIL
    var supportItem: Support = {
      post: this.post!,
      value: +pay
    }
    this.user?.support.push(supportItem)
    this.toastr.success("You supported " + this.post?.user.username + " for " + pay + " euros")
    this.closePay();
    await this.userService.updateUser(this.user!).then(res => {
      this.authService.setUser(res.user)
      this.user = res.user
    })

    var supportedByItem: SupportedBy = {
      user: this.user!,
      value: +pay
    };
    this.post?.supportedBy.push(supportedByItem)
    this.postsService.updatePost(this.post!)
  }


  cancelPay() {
    this.closePay();
  }

  closePay() {
    this.animationState = "out"
    this.darkBGArea!.nativeElement.style.opacity = "0";
    this.darkBGArea!.nativeElement.style.maxHeight = "0";
    this.generalService.changeCurrentBackButtonEnabled(true);
    // this.generalService.forDummyPreventGoBack({ supporting: false });
  }

  likedByUser() {
    if (this.user?.likes)
      for (let like of this.user.likes) {
        if (this.post?._id == like._id) {
          return true;
        }
      }
    return false;
  }

  supportedByUser() {
    if (this.user?.support)
      for (let support of this.user.support) {
        if (this.post?._id == support.post._id) {
          return true;
        }
      }
    return false;
  }

  commentedByUser() {
    if (this.post?.comments)
      for (let comment of this.post?.comments) {
        if (this.user?._id == comment.user._id) {
          return true;
        }
      }
    return false;
  }

  openComments() {
    this.commentsArea!.nativeElement.style = !this.comments ? "display: block" : "display: none";
    if (!this.comments) {
      this.commentInputArea!.nativeElement.focus();
    } else {
      this.commentInputArea!.nativeElement.blur();
    }
    this.comments = !this.comments;
    this.cd.detectChanges();
  }

  addComment() {
    const commentData: Comment = {
      user: this.user!,
      comment: this.form?.value.commentInput
    }
    this.post?.comments.push(commentData);
    // this.postsService.updatePostComments(this.post!, commentData)
    this.postsService.updatePost(this.post!)
  }

  loadMoreComments() {
    this.end = 6
    this.showLoadBtn = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.darkBGArea?.nativeElement.contains(event.target)) {
      this.closePay();
    }
  }
}
