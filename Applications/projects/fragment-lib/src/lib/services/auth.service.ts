import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from '../components/auth/auth-data.model';
import { environment } from "../environments/environment"
import { User } from '../models/user.model';

const BACKEND_URL = environment.apiUrl + "/auth/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token?: string | null;
  private user?: User | null;
  private tokenTimer: any;
  private userId?: string | null;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUser(): User {
    return this.user!;
  }

  setUser(user: User) {
    this.user = user
    localStorage.setItem("user", JSON.stringify(user));

  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, photo: File, username: string) {
    console.log(photo)
    const postData = new FormData();
    postData.append("email", email);
    postData.append("password", password);
    postData.append("photo", photo, photo?.name);
    postData.append("username", username);

    this.http.post(BACKEND_URL + "signup", postData)
      .subscribe(() => {
        this.login(email, password);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    //Angulat knows <{token: string}> because this is what we are returning from the backend
    this.http.post<{ token: string, expiresIn: number, userId: string, user: any }>(BACKEND_URL + "login", authData)
      .subscribe(response => {
        
        const token = response.token;
        this.token = token;
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.user = response.user;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId, this.user!);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.user = JSON.parse(localStorage.getItem("user")!);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.user = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    // this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("user", JSON.stringify(user));
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user")!);
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      user: user
    }
  }

  getUserLocal(){
    return JSON.parse(localStorage.getItem("user")!);
  }

}
