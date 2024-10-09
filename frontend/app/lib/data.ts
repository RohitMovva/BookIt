// fetch data

import { Condition, Listing } from "./definitions";
import { v4 as uuidv4 } from "uuid";

// Updated placeholder data function
export async function fetchFilteredListings(query: string): Promise<Listing[]> {
  return [
    {
      uuid: uuidv4(),
      title: "Beautiful Apartment in the City",
      description: "A spacious 2-bedroom apartment with a stunning view.",
      price: 1200,
      contactInfo: {
        phone: "123-456-7890",
        email: "owner@example.com",
      },
      thumbnail: "https://example.com/image1.jpg",
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg",
      ],
      tags: {
        condition: Condition.Good,
        class: "apartment",
      },
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
      thumbnail: "https://example.com/image4.jpg",
      images: [
        "https://example.com/image4.jpg",
        "https://example.com/image5.jpg",
        "https://example.com/image6.jpg",
      ],
      tags: {
        condition: Condition.VeryGood,
        class: "cottage",
      },
    },
    // More placeholder items as needed
  ];
}
