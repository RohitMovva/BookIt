// fetch data

import { Condition, Listing } from "./definitions";

// Updated placeholder data function
export async function fetchFilteredListings(query: string): Promise<Listing[]> {
  return [
    {
      title: "Sample Item 1",
      description: "A very nice item in good condition.",
      price: 99.99,
      contactInfo: { phone: "123-456-7890", email: "example1@example.com" },
      thumbnail: "/placeholderparrot.jpg",
      images: ["/placeholderparrot.jpg", "/placeholderparrot.jpg"],
      tags: { condition: Condition.Good, class: "Electronics" },
    },
    {
      title: "Sample Item 2",
      description: "Almost like new and lightly used.",
      price: 150.0,
      contactInfo: { phone: "987-654-3210", email: "example2@example.com" },
      thumbnail: "/placeholderparrot.jpg",
      images: ["/placeholderparrot.jpg"],
      tags: { condition: Condition.LikeNew, class: "Furniture" },
    },
    // More placeholder items as needed
  ];
}

