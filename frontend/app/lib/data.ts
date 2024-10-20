import { Condition, Listing } from "./definitions";
import axios from 'axios';

export async function fetchFilteredListings(
  query: string,
  currentPage: number,
  itemsPerPage: number = 20
): Promise<Listing[]> {
  try {
    const response = await axios.get('http://127.0.0.1:5000/get-listings', {
      params: {
        query,
        page: currentPage,
        per_page: itemsPerPage
      },
      withCredentials: true
    });

    if (response.status === 200) {
      const listings: Listing[] = response.data.listings.map((listing: any) => ({
        uuid: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        phone: listing.phone_number,
        email: listing.email_address,
        thumbnail: listing.thumbnail_image,
        images: listing.other_images || [],
        condition: listing.condition as Condition,
        date: listing.date,
        class: listing.class_type,
        saved: listing.saved
      }));

      return listings;
    } else {
      throw new Error('Failed to fetch listings');
    }
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
}

// returns number of pages for a query
export async function fetchListingsPages(query: string) {
  return 2;
}

// idk if we want this or just a getUserInfo() function would be enough
export async function fetchUserProfilePicture() {
  return "/user.png";
}