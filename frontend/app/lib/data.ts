import { Condition, Listing } from "./definitions";
import axios from "axios";

export async function fetchFilteredListings(
  query: string,
  currentPage: number,
  itemsPerPage: number = 20,
  min_price: number,
  max_price: number
): Promise<Listing[]> {
  try {
    const response = await axios.get("http://127.0.0.1:5000/get-listings", {
      params: {
        query,
        page: currentPage,
        per_page: itemsPerPage,
        sort_by: "price",
        sort_order: "desc",
        min_price: min_price,
        max_price: max_price,
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      const listings: Listing[] = response.data.listings.map((listing: any) => ({
        uuid: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        phone: listing.phone_number,
        email: listing.email_address,
        thumbnail_image: listing.thumbnail_image,
        other_images: listing.other_images || [],
        condition: listing.condition as Condition,
        date: listing.date,
        class: listing.class_type,
        saved: listing.saved
      }));
      console.log(listings)

      return listings;
    } else {
      throw new Error("Failed to fetch listings");
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export async function fetchUserListings(
  query: string,
  currentPage: number,
  itemsPerPage: number = 20,
): Promise<Listing[]> {
  try {
    const user = await axios.get("http://127.0.0.1:5000/current-user", {
      withCredentials: true,
    });
    if (user.status === 200) {
      const response = await axios.get(
        `http://127.0.0.1:5000/get-user-listings/${user.data.id}`,
        {
          params: {
            query,
            page: currentPage,
            per_page: itemsPerPage,
            sort_by: "price",
            sort_order: "desc",
            min_price: 50.0,
            max_price: 100.0,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const listings: Listing[] = response.data.listings.map((listing: any) => ({
          uuid: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          phone: listing.phone_number,
          email: listing.email_address,
          thumbnail_image: listing.thumbnail_image,
          images: listing.other_images || [],
          condition: listing.condition as Condition,
          date: listing.date,
          class: listing.class_type,
          saved: listing.saved
        }));

        return listings;
      } else {
        throw new Error("Failed to fetch listings");
      }
    } else {
      throw new Error("Failed to fetch user");
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export async function fetchSavedListings(
  query: string,
  currentPage: number,
  itemsPerPage: number = 20,
): Promise<Listing[]> {
  try {
    const user = await axios.get("http://127.0.0.1:5000/current-user", {
      withCredentials: true,
    });
    if (user.status === 200) {
      const response = await axios.get(
        `http://127.0.0.1:5000/get-saved-listings/${user.data.id}`,
        {
          params: {
            query,
            page: currentPage,
            per_page: itemsPerPage,
            sort_by: "price",
            sort_order: "desc",
            min_price: 50.0,
            max_price: 100.0,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const listings: Listing[] = response.data.listings.map((listing: any) => ({
          uuid: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          phone: listing.phone_number,
          email: listing.email_address,
          thumbnail_image: listing.thumbnail_image,
          images: listing.other_images || [],
          condition: listing.condition as Condition,
          date: listing.date,
          class: listing.class_type,
          saved: listing.saved
        }));

        return listings;
      } else {
        throw new Error("Failed to fetch listings");
      }
    } else {
      throw new Error("Failed to fetch user");
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export async function cooltoggleSaved(uuid: string, saved: boolean) {
  try {
    const config = {
      withCredentials: true, // This needs to be in the config object
    };

    let response;
    if (!saved) {
      response = await axios.post(
        `http://127.0.0.1:5000/save-listing/${uuid}`,
        {}, // empty body
        config,
      );
    } else {
      response = await axios.post(
        `http://127.0.0.1:5000/unsave-listing/${uuid}`,
        {}, // empty body
        config,
      );
    }

    if (response.status === 200) {
      return !saved;
    }
    throw new Error('Failed to toggle saved');
  } catch (error) {
    console.error('Error toggling saved status:', error);
    throw error;
  }
}

export async function createListing(listing: Listing) {
  try {
    const response = await axios.post('http://127.0.0.1:5000/create-listing', {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      phone_number: listing.phone,
      email_address: listing.email,
      thumbnail_image: listing.thumbnail_image,
      other_images: listing.other_images,
      condition: listing.condition,
      class_type: "english", // JOSHUA ADD THIS
    }, {
      withCredentials: true
    });
    console.log(response)
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to create listing');
    }
  } catch (error) {
    console.error('Error creating listing:', error);
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
