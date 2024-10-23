"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { fetchFilteredListings, fetchUserListings, fetchSavedListings, cooltoggleSaved, cooldeleteListing } from "../../lib/data";
import { Listing } from "../../lib/definitions";
import ImageComponent from "../image";
import { only } from "node:test";
import axios from 'axios';

export default function ListingGallery({ hasUser, onlySaved }: { hasUser?: boolean, onlySaved?: boolean }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false); // State for tooltip visibility
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const min_price = searchParams.get("min") || "";
  const max_price = searchParams.get("max") || "";
  const sort_type = searchParams.get("sort") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    const loadListings = async () => {
      let data;
      console.log(onlySaved), console.log(hasUser)
      if (hasUser) {
        data = await fetchUserListings(query, currentPage);
      } else if (onlySaved){
        data = await fetchSavedListings(query, currentPage) 
      }
      else {
        const sort_by = "price";
        const sort_order = sort_type === "low" ? "asc" : sort_type === "high" ? "desc" : "";
        console.log("Sort by and sort order", sort_by, sort_order)
        data = await fetchFilteredListings(query, currentPage, Number(min_price), Number(max_price), sort_by, sort_order);
      }
      console.log(data)
      setListings(data);
      console.log("Listings: ", listings)
    };
    loadListings();
  }, [query, min_price, max_price, sort_type]);

  const openListing = (listing: Listing) => setSelectedListing(listing);
  const closeListing = () => setSelectedListing(null);

  const handleListingClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeListing();
    }
  };

  const toggleSaved = (uuid: string, saved: boolean) => {
    return cooltoggleSaved(uuid, saved);
  };

  const deleteListing = async (uuid: string) => {
    console.log("Deleting listing with uuid: ", uuid);
    return cooldeleteListing(uuid);
  }

  const handleCopyLink = useCallback((uuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/listing/${uuid}`;
    navigator.clipboard.writeText(url).then(() => {
      setTooltipVisible(true); // Show the tooltip
      setTimeout(() => setTooltipVisible(false), 2000); // Hide it after 2 seconds
    });
  }, []);

  return (
    <>
      {tooltipVisible && (
        <p className="fixed bottom-12 left-12 z-30 transform rounded bg-blue-800 p-3 pr-12 text-center text-white">
          Link copied!
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {listings.map((listing) => (
          <article
            key={listing.uuid}
            className="relative cursor-pointer rounded-xl"
            onClick={() => openListing(listing)}
          >
            <ImageComponent
              img={
                listing.thumbnail_image
                  ? listing.thumbnail_image
                  : "/placeholderparrot.jpg"
              }
              h="h-96"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent from-40% via-black/80 via-80% to-black/80"></div>
            <div className="absolute bottom-0 grid w-full gap-4 p-4 text-white">
              <div>
                <h2 className="text-2xl">{listing.title}</h2>
                <p className="text-s line-clamp-1 overflow-hidden text-ellipsis text-neutral-300">
                  {listing.description}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center">
                <p className="text-3xl">${listing.price}</p>
                <div className="flex place-items-center space-x-2 justify-self-end">
                  <div
                    onClick={(e) => handleCopyLink(listing.uuid, e)}
                    className="relative cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <Image
                      src="/share-white.png"
                      alt="Share"
                      width={28}
                      height={28}
                    />
                  </div>
                  {pathname !== "/listings" && (
                    <Image
                      src={
                        listing.saved
                          ? "/bookmark-filled.png"
                          : "/bookmark-white.png"
                      }
                      alt=""
                      width={28}
                      height={28}
                      className="cursor-pointer transition-all duration-300 hover:-translate-y-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaved(listing.uuid, listing.saved).then((saved) => {
                          listing.saved = saved;
                          setListings([...listings]);
                        });
                      }}
                    />
                  )}
                  {pathname === "/listings" && (
                    <Image
                      src={"/trash-bin-red.png"}
                      alt=""
                      width={28}
                      height={28}
                      className="cursor-pointer transition-all duration-300 hover:-translate-y-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Deleting listing with uuid: ", listing.uuid);
                        deleteListing(listing.uuid).then(() => {
                          setListings([...listings]);
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {/* Listing Popup */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleListingClick}
        >
          {/* Content */}
          <div className="relative flex h-screen w-3/4 rounded-lg bg-white shadow-lg">
            {/* Images (left) */}
            <div className="w-1/2 overflow-y-auto border-r p-4">
              <div className="h-80">
                <ImageComponent
                  img={
                    selectedListing.thumbnail_image
                      ? selectedListing.thumbnail_image
                      : "/placeholderparrot.jpg"
                  }
                  w="w-full"
                  h="h-full"
                />
              </div>
              {/* <img
                src={selectedListing.thumbnail_image}
                alt={selectedListing.title}
                className="mb-4 h-48 w-full rounded-md object-cover"
              /> */}
              {(selectedListing.other_images || []).map((img, idx) => (
                <div>
                  <ImageComponent
                    img={img ? img : "/placeholderparrot.jpg"}
                    w="w-full"
                    h="h-80"
                  />
                </div>
              ))}
            </div>
            {/* Text (right) */}
            <div className="w-1/2 overflow-y-auto p-6">
              <h2 className="mb-2 text-2xl font-semibold">
                {selectedListing.title}
              </h2>
              <p className="mb-4 text-gray-700">
                {selectedListing.description}
              </p>
              <p className="mb-4 text-lg font-bold text-blue-600">
                ${selectedListing.price}
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Condition: {selectedListing.condition}
              </p>
              <p className="font-semibold">Contact Information:</p>
              <p className="text-sm text-gray-700">
                Phone: {selectedListing.phone}
              </p>
              <p className="text-sm text-gray-700">
                Email: {selectedListing.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
