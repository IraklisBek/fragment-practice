import { Tag } from "./tag.model";
import { User } from "./user.model";

export interface SupportedBy {
  // _id: string;
  user: User;
  value: number;
}

export interface Comment {
  // _id: string;
  user: User;
  comment: string;
  repliedBy?: [{
    user: User;
    comment: string;
  }];
  created_at?: Date;
  updated_at?: Date;
}

export interface Post {
  _id: string;
  user: User;
  kind: string;
  location: string;
  photo: string;
  tags: Tag[];
  description: string;
  title: string;
  photos: string[];
  videos: string[];
  music: string[];
  likedBy: User[];
  supportedBy: SupportedBy[];
  comments: Comment[];
}
