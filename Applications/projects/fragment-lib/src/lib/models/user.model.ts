import { Notification } from "./notification.model";
import { Post } from "./post.model";

export interface Support {
  post: Post;
  value: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  photo: string;
  posts: Post[];
  likes: Post[];
  support: Support[];
  following: User[];
  followers: User[];
  notifications: Notification[];
}
