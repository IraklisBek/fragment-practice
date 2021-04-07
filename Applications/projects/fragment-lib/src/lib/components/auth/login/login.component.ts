import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub?: Subscription;
  imagePreview?: string;
  file: File = new File([], "");
  user?: User;
  userId?: string | null;
  constructor(
    public authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    sign_up_btn!.addEventListener("click", () => {
      container!.classList.add("sign-up-mode");
    });

    sign_in_btn!.addEventListener("click", () => {
      container!.classList.remove("sign-up-mode");
    });

  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password, this.file, form.value.username);
    // this.authService.login(form.value.email, form.value.password);
  }

  deleteFile(src: string) {
    this.imagePreview = ''
  }

  onImagePicked(event: Event) {
    console.log(event)
    const file = (event.target as HTMLInputElement).files![0];
    this.file = file
    const reader = new FileReader();
    reader.onload = () => {//async code, will take a while
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }

}
