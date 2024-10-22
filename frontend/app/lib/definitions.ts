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
  price: string;
  phone: string;
  email: string;
  thumbnail: string;
  images: string[];
  condition: Condition;
  date: string;
  class?: string;
  saved: boolean;
}

export interface ButtonProps {
  text?: string;
  bgColor?: string;
  bgHover?: string;
  border?: string;
  borderColor?: string;
  textColor?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  img?: string;
  size?: number;
  imgSide?: "r" | "l";
  alt?: string;
  onClick?: () => void;
  isOpen?: boolean;
  noAnimation?: boolean;
}