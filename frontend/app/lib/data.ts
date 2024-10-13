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
      uuid: "1a2b3c",
      title: "Vintage Wooden Desk",
      description:
        "A beautiful wooden desk with ample storage and a classic vintage look.",
      price: 150.0,
      phone: "123-456-7890",
      email: "seller1@example.com",
      thumbnail: "/placeholderparrot.jpg",
      images: [
        "/placeholderparrot.jpg",
        "/placeholderparrot.jpg",
        "/placeholderparrot.jpg",
      ],
      condition: Condition.Good,
      date: "2024-09-15",
      class: "Furniture",
      saved: false,
    },
    {
      uuid: "4d5e6f",
      title: "Mountain Bike",
      description:
        "A rugged mountain bike suitable for all terrains, only lightly used.",
      price: 350.0,
      phone: "234-567-8901",
      email: "seller2@example.com",
      thumbnail: "/placeholderparrot.jpg",
      images: ["/placeholderparrot.jpg", "/placeholderparrot.jpg"],
      condition: Condition.VeryGood,
      date: "2024-08-20",
      class: "Sports",
      saved: true,
    },
    {
      uuid: "7g8h9i",
      title: "Modern Sofa",
      description: "Comfortable 3-seater sofa in a modern design, grey fabric.",
      price: 500.0,
      phone: "345-678-9012",
      email: "seller3@example.com",
      thumbnail: "/placeholderparrot.jpg",
      images: [
        "/placeholderparrot.jpg",
        "/placeholderparrot.jpg",
        "/placeholderparrot.jpg",
      ],
      condition: Condition.LikeNew,
      date: "2024-10-01",
      class: "Furniture",
      saved: false,
    },
    {
      uuid: "0j1k2l",
      title: "Canon DSLR Camera",
      description:
        "Professional DSLR camera with 18-55mm lens, includes bag and extra battery.",
      price: 750.0,
      phone: "456-789-0123",
      email: "seller4@example.com",
      thumbnail: "/placeholderparrot.jpg",
      images: ["/placeholderparrot.jpg", "/placeholderparrot.jpg"],
      condition: Condition.Acceptable,
      date: "2024-07-10",
      class: "Electronics",
      saved: true,
    },
    {
      uuid: "3m4n5o",
      title: "Harry Potter Book Set",
      description:
        "Complete set of Harry Potter books in good condition. Hardcover editions.",
      price: 80.0,
      phone: "567-890-1234",
      email: "seller5@example.com",
      thumbnail: "/placeholderparrot.jpg",
      images: ["/placeholderparrot.jpg"],
      condition: Condition.Good,
      date: "2024-05-22",
      class: "Books",
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