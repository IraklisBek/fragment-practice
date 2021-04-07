import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Notification } from '../models/notification.model';
const BACKEND_URL = environment.apiUrl + "/notifications/";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private http: HttpClient
  ) { }

  public addNotification(notification: Notification) {
    return this.http.post<Notification>(BACKEND_URL, notification).toPromise()
  }

  public updateNotification(notification: Notification) {
    return this.http.put<Notification>(BACKEND_URL + notification._id, notification).toPromise()
  }

  public deleteNotification(notification: Notification, userId: string) {
    return this.http.delete<Notification>(BACKEND_URL + notification._id + "/" + userId).toPromise()
  }

  public getNotificationByPostAndKind(postId: string, kind: string) {
    return this.http.get<Notification>(BACKEND_URL + postId + "/" + kind).toPromise()
  }
}
