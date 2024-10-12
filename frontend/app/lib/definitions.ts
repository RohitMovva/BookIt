import { v4 as uuidv4 } from "uuid";

// define data
export enum Condition {
  Bad = "Bad",
  Acceptable = "Acceptable",
  Good = "Good",
  VeryGood = "Very Good",
  LikeNew = "Like New",
}

export interface Listing {
  uuid: string;
  title: string;
  description: string;
  price: number;
  phone: string;
  email: string;
  thumbnail: string;
  images: string[];
  condition: Condition;
  date: string;
  class?: string;
  saved: boolean;
}