import { Post } from "./post.model";
import { User } from "./user.model";

export interface Notification {
  _id?: string;
  title: string;
  kind: string;
  post: Post;
  users_involved: User[];
  read: boolean;
  created_at?: Date;
  updated_at?: Date;
}
