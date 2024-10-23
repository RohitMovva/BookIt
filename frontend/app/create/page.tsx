"use client";

import { useState } from "react";
import { Condition, Listing } from "../lib/definitions";
import { createListing } from "../lib/data";
import Image from "next/image";
import ImageComponent from "../ui/image";
import Input from "../ui/input";
import Textarea from "../ui/text-area";
import StyledSelect from "../ui/select";
import { useRouter } from "next/navigation";
import TopBar from "../ui/home/top-bar";

// Utility function to convert blob to base64
const blobToBase64 = async (blob: string): Promise<string> => {
  // If the blob is already a base64 string, return it
  if (blob.startsWith("data:")) {
    return blob;
  }

  // Convert blob string to actual Blob object
  const response = await fetch(blob);
  const blobData = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blobData);
  });
};

export default function CreateListing() {
  const router = useRouter();
  const [listing, setListing] = useState<Listing>({
    uuid: "",
    title: "",
    description: "",
    price: "",
    phone: "",
    email: "",
    thumbnail_image: "",
    other_images: [],
    condition: Condition.Good,
    date: new Date().toISOString(),
    class: "",
    saved: false,
  });

  const [phoneError, setPhoneError] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const phoneRegex = /^[0-9]{10}$/;

  const handleSubmit = async () => {
    setPhoneError(false);
    setFormError("");

    if (
      !listing.title ||
      !listing.description ||
      !listing.price ||
      !listing.condition ||
      !listing.phone ||
      !listing.thumbnail_image
    ) {
      setFormError("Please fill out all fields.");
      return;
    }

    // Check if phone is provided before validating
    if (listing.phone && !phoneRegex.test(listing.phone)) {
      setPhoneError(true);
      setFormError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      // Convert thumbnail to base64
      const base64Thumbnail = await blobToBase64(listing.thumbnail_image);

      // Convert all images to base64
      const base64Images = await Promise.all(
        listing.other_images.map((image) => blobToBase64(image)),
      );

      // Create new listing object with base64 converted images
      const listingWithBase64 = {
        ...listing,
        thumbnail_image: base64Thumbnail,
        other_images: base64Images,
      };

      console.log("Form submitted successfully:", listingWithBase64);
      createListing(listingWithBase64);
      router.push("/");
    } catch (error) {
      setFormError("Error converting images. Please try again.");
      console.error("Error converting images to base64:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    // Clear form error when editing
    setFormError("");

    setListing((prevListing) => ({
      ...prevListing,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handlePhoneBlur = () => {
    if (listing.phone && !phoneRegex.test(listing.phone)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFiles = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      console.log(imageFiles);
      setListing((prevListing) => ({
        ...prevListing,
        thumbnail_image: imageFiles[0] || "",
      }));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFiles = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setListing((prevListing) => ({
        ...prevListing,
        other_images: imageFiles,
        // thumbnail_image: imageFiles[0] || "",
      }));
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedListing(null);
  };
  function openListing(listing: Listing): void {
    throw new Error("Function not implemented.");
  }

  console.log("THUMBNAIL: ", listing.thumbnail_image);

  const options = Object.entries(Condition).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  return (
    <>
      <TopBar />
      <div className="mx-20 grid gap-20 p-4 md:grid-cols-2">
        <div>
          <h1 className="mb-4 text-2xl font-bold">Create Listing</h1>
          <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="text"
              name="title"
              placeholder="Title"
              value={listing.title}
              onChange={handleChange}
            />
            <Textarea
              name="description"
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              value={listing.description}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="price"
              placeholder="Price"
              value={listing.price}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="phone"
              placeholder="Phone"
              className={`input w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                phoneError ? "border-red-500" : "input-bordered"
              }`}
              value={listing.phone}
              onChange={handleChange}
              onBlur={handlePhoneBlur}
            />
            {phoneError && <p className="text-red-500">Invalid phone number</p>}{" "}
            <Input
              type="text"
              name="class"
              placeholder="Class"
              className="input input-bordered w-full"
              value={listing.class}
              onChange={handleChange}
            />
            <StyledSelect
              name="condition"
              value={listing.condition}
              onChange={handleChange}
              options={options}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="file-input file-input-bordered w-full"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="file-input file-input-bordered w-full"
            />
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={handleSubmit}
            >
              Submit
            </button>
            {formError && <p className="text-red-500">{formError}</p>}{" "}
          </form>
        </div>

        {/* Live Preview */}
        <div className="w-full max-w-96">
          <h2>Live Preview</h2>
          <article
            className="relative cursor-pointer rounded-xl"
            onClick={() => {
              setSelectedListing(listing);
              setIsPopupOpen(true);
            }}
          >
            <ImageComponent
              h="h-96"
              img={
                listing.thumbnail_image
                  ? listing.thumbnail_image
                  : "/placeholderparrot.jpg"
              } // Use uploaded image or placeholder
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
                <p className="text-3xl">
                  {listing.price !== "" ? `$${listing.price}` : ""}{" "}
                </p>
                <div className="flex place-items-center space-x-2 justify-self-end">
                  <div className="relative cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <Image
                      src="/share-white.png"
                      alt="Share"
                      width={28}
                      height={28}
                    />
                  </div>
                  <Image
                    src={
                      listing.saved
                        ? "/bookmark-filled.png"
                        : "/bookmark-white.png"
                    }
                    alt="Bookmark"
                    width={28}
                    height={28}
                    className="cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Popup for live preview */}
        {isPopupOpen && selectedListing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={closePopup}
          >
            {/* Content */}
            <div className="relative flex h-screen w-screen flex-col overflow-y-auto rounded-lg bg-white shadow-lg md:mx-20 md:w-full md:flex-row md:overflow-hidden lg:mx-40">
              {/* Images (left) */}
              <div className="order-last mx-4 flex-col border-r md:order-first md:w-1/2 md:overflow-y-auto">
                <div className="h-96">
                  <ImageComponent
                    w="w-full"
                    h="h-full"
                    img={
                      selectedListing.thumbnail_image
                        ? selectedListing.thumbnail_image
                        : "/placeholderparrot.jpg"
                    }
                  />
                </div>
                {selectedListing.other_images.map((img, idx) => (
                  <div key={idx}>
                    <ImageComponent w="w-full" h="h-80" img={img} />
                  </div>
                ))}
              </div>
              {/* Text (right) */}
              <div className="w-1/2 p-6 md:overflow-y-auto">
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
                  Class: {selectedListing.class}
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
      </div>
    </>
  );
}
