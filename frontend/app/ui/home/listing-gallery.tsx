"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { fetchFilteredListings } from "../../lib/data";
import { Listing } from "../../lib/definitions";
import ImageComponent from "../image";

export default function ListingGallery() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const loadListings = async () => {
      const data = await fetchFilteredListings(query, currentPage);
      setListings(data);
    };
    loadListings();
  }, [query]);

  const openListing = (listing: Listing) => setSelectedListing(listing);
  const closeListing = () => setSelectedListing(null);

  // Handle clicks outside of the Listing to close it
  const handleListingClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeListing();
    }
  };

  const toggleSaved = (uuid: string) => {
    console.log(`Saved toggled for UUID: ${uuid}`);
    // Here you can add the logic to handle the Saved action
  };

  return (
    <>
      {/* Responsive Grid for Listings */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {/* Listing */}
        {listings.map((listing) => (
          <article
            key={listing.uuid}
            className="relative cursor-pointer rounded-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => openListing(listing)}
          >
            <ImageComponent />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent from-40% via-black/80 via-80% to-black"></div>
            {/* Content */}
            <div className="absolute bottom-0 grid w-full gap-4 p-4 text-white">
              <div>
                <h2 className="text-2xl">{listing.title}</h2>
                <p className="text-s line-clamp-1 overflow-hidden text-ellipsis text-neutral-300">
                  {listing.description}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center">
                <p className="text-3xl">${listing.price}</p>
                <Image
                  src={
                    listing.saved
                      ? "/bookmark-filled.png"
                      : "/bookmark-white.png"
                  }
                  alt=""
                  width={28}
                  height={28}
                  className="cursor-pointer justify-self-end transition-all duration-300 hover:-translate-y-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaved(listing.uuid);
                  }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
      {/* Popup Listing */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleListingClick}
        >
          <div className="relative flex h-5/6 w-11/12 max-w-4xl rounded-lg bg-white shadow-lg">
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
    </>
  );
}
