// fetch data

import { Condition, Listing } from "./definitions";
import { v4 as uuidv4 } from "uuid";

// returns listings with query and current page (lets do 20 items per page for now)
export async function fetchFilteredListings(
  query: string,
  currentPage: number,
): Promise<Listing[]> {
  return [
    {
      uuid: uuidv4(),
      title: "Beautiful Apartment in the City",
      description:
        "A spacious 2-bedroom apartment with a stunning view. asdfasdf asdf asdf asd fasd fas dfa sdfa sdf asdfa sdf asd fasd fasdf asdf asdf asdf asdf asdf  ",
      price: 1200,
      contactInfo: {
        phone: "123-456-7890",
        email: "owner@example.com",
      },
      thumbnail: "/placeholderparrot.jpg",
      images: [
        "/placeholderparrot.jpg",
        "/placeholderparrot.jpg",
        "/placeholderparrot.jpg",
      ],
      tags: {
        condition: Condition.Good,
        class: "apartment",
      },
      saved: true,
    },
    {
      uuid: uuidv4(),
      title: "Cozy Cottage in the Woods",
      description: "A lovely cottage surrounded by nature.",
      price: 800,
      contactInfo: {
        phone: "987-654-3210",
        email: "cottageowner@example.com",
      },
      thumbnail: "/placeholderparrot.jpg",
      images: [
        "/placeholderparrot.jpg",
        "/placeholderparrot.jpg",
        "/placeholderparrot.jpg",
      ],
      tags: {
        condition: Condition.VeryGood,
        class: "cottage",
      },
      saved: false,
    },
  ];
}

// returns number of pages for a query
export async function fetchListingsPages(query: string) {
  return 2;
}

// idk if we want this or just a getUserInfo() function would be enough
export async function fetchUserProfilePicture() {
  return "/user.png";
}