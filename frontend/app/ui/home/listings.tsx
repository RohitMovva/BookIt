"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchFilteredListings } from "../../lib/data"; // Adjust the path
import { Listing } from "../../lib/definitions"; // Adjust the path

export default function ListingGallery() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const loadListings = async () => {
      const data = await fetchFilteredListings(query);
      setListings(data);
    };
    loadListings();
  }, [query]);

  const openModal = (listing: Listing) => setSelectedListing(listing);
  const closeModal = () => setSelectedListing(null);

  return (
    <div>
      {/* Responsive Grid for Listings */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-lg border bg-white p-4 shadow-lg"
            onClick={() => openModal(listing)}
          >
            <img
              src={listing.thumbnail}
              alt={listing.title}
              className="h-40 w-full rounded-md object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold">{listing.title}</h3>
            <p className="mt-1 text-gray-700">{listing.description}</p>
            <p className="mt-1 text-sm text-gray-500">
              {listing.tags.condition}
            </p>
            <p className="mt-2 font-bold text-blue-600">
              ${listing.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative flex h-5/6 w-11/12 max-w-4xl rounded-lg bg-white shadow-lg">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &#x2715;
            </button>

            {/* Left Side: Images */}
            <div className="w-1/2 overflow-y-auto border-r p-4">
              <img
                src={selectedListing.thumbnail}
                alt={selectedListing.title}
                className="mb-4 h-48 w-full rounded-md object-cover"
              />
              {selectedListing.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${selectedListing.title} image ${idx + 1}`}
                  className="mb-4 h-48 w-full rounded-md object-cover"
                />
              ))}
            </div>

            {/* Right Side: Listing Details */}
            <div className="w-1/2 overflow-y-auto p-6">
              <h2 className="mb-2 text-2xl font-semibold">
                {selectedListing.title}
              </h2>
              <p className="mb-4 text-gray-700">
                {selectedListing.description}
              </p>
              <p className="mb-4 text-lg font-bold text-blue-600">
                ${selectedListing.price.toFixed(2)}
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Condition: {selectedListing.tags.condition}
              </p>
              <p className="font-semibold">Contact Information:</p>
              <p className="text-sm text-gray-700">
                Phone: {selectedListing.contactInfo.phone}
              </p>
              <p className="text-sm text-gray-700">
                Email: {selectedListing.contactInfo.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
