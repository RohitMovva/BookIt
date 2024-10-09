// define data
export enum Condition {
  Bad = "Bad",
  Acceptable = "Acceptable",
  Good = "Good",
  VeryGood = "Very Good",
  LikeNew = "Like New",
}

export interface ListingTags {
  condition: Condition;
  class?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface Listing {
  title: string;
  description: string;
  price: number;
  contactInfo: ContactInfo;
  thumbnail: string;
  images: string[];
  tags: ListingTags;
}
