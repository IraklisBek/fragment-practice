import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@fragment-lib';
import { User } from '@fragment-lib';
import { UserService } from '@fragment-lib';
import { PostsService } from '@fragment-lib';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isMe: boolean = false;
  showUnfollow: boolean = false;
  loggedInUser = this.authService.getUser()
  userId?: string;
  user?: User
  followText?: string;
  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private postsService: PostsService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    route.queryParams.subscribe(p => {
      this.userId = p.userId
      this.usersService.getUser(this.userId!).then((res: any) => {
        this.user = res
        this.followText = this.followingUser() ? "following" : "follow"
      })
      if (this.userId == this.authService.getUserId()) {
        this.isMe = true;
      }
    });

  }

  ngOnInit() {

  }

  followingUser() {
    for (let following of this.loggedInUser.following) {
      if (following._id == this.user?._id) {
        return true;
      }
    }
    return false;
  }

  async follow() {
    if (!this.followingUser()) {
      this.toastrService.success("You follow " + this.user?.username)
      this.followText = "following";
      this.showUnfollow = false;
      this.loggedInUser.following.push(this.user!);
      await this.usersService.updateUser(this.loggedInUser).then(res => {
        this.user?.followers.push(res.user);
        this.usersService.updateUser(this.user!);
      });
    } else {
      this.showUnfollow = !this.showUnfollow;
    }


  }

  async unfollow() {
    this.toastrService.success("You unfollowed " + this.user?.username)
    this.followText = "follow";
    this.showUnfollow = false;
    this.loggedInUser.following = this.loggedInUser.following.filter(el => el._id !== this.user?._id)
    await this.usersService.updateUser(this.loggedInUser).then(res => {
      this.user!.followers = this.user!.followers.filter(el => el._id !== this.loggedInUser._id)
      this.usersService.updateUser(this.user!);
    });
  }

}
