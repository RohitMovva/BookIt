"use client";

import { useState } from "react";
import { Condition, Listing } from "../lib/definitions";
import Image from "next/image";
import ImageComponent from "../ui/image";

export default function CreateListing() {
  const [listing, setListing] = useState<Listing>({
    uuid: "",
    title: "",
    description: "",
    price: "", // Default price is now an empty string
    phone: "",
    email: "",
    thumbnail: "",
    images: [],
    condition: Condition.Good,
    date: new Date().toISOString(),
    saved: false,
  });

  const [phoneError, setPhoneError] = useState(false); // Track phone validity
  const [formError, setFormError] = useState(""); // Track form submission error

  const phoneRegex = /^[0-9]{10}$/; // Simple validation for 10-digit phone numbers

  const handleSubmit = () => {
    // Reset errors
    setPhoneError(false);
    setFormError("");

    // Check if all fields are filled
    if (
      !listing.title ||
      !listing.description ||
      !listing.price ||
      !listing.phone ||
      !listing.condition ||
      listing.images.length === 0
    ) {
      setFormError("Please fill out all fields.");
      return;
    }

    // Validate phone number
    if (!phoneRegex.test(listing.phone)) {
      setPhoneError(true);
      setFormError("Please enter a valid 10-digit phone number.");
      return;
    }

    // If all validations pass, proceed with form submission logic
    console.log("Form submitted successfully:", listing);
    // Here you can handle the form submission (e.g., send data to the server)
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setListing((prevListing) => ({
      ...prevListing,
      [name]:
        name === "price"
          ? value === "" // Keep it empty if no input
            ? ""
            : Number(value) // Convert to number if input exists
          : value,
    }));
  };

  const handlePhoneBlur = () => {
    // Validate phone number on blur
    if (!phoneRegex.test(listing.phone)) {
      setPhoneError(true); // Invalid phone number
    } else {
      setPhoneError(false); // Valid phone number
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFiles = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setListing((prevListing) => ({
        ...prevListing,
        images: imageFiles,
        thumbnail: imageFiles[0] || "",
      }));
    }
  };

  function openListing(listing: Listing): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Create Listing</h1>
      <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="input input-bordered w-full"
          value={listing.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          value={listing.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="input input-bordered w-full"
          value={listing.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="phone"
          placeholder="Phone"
          className={`input w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
            phoneError ? "border-red-500" : "input-bordered"
          }`} // Conditionally apply red border if invalid
          value={listing.phone}
          onChange={handleChange}
          onBlur={handlePhoneBlur} // Validate on blur
        />
        {phoneError && <p className="text-red-500">Invalid phone number</p>}{" "}
        <select
          name="condition"
          className="select select-bordered w-full"
          value={listing.condition}
          onChange={handleChange}
        >
          {Object.values(Condition).map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full"
        />
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={handleSubmit} // Call handleSubmit when clicked
        >
          Submit
        </button>
        {formError && <p className="text-red-500">{formError}</p>}{" "}
        {/* Show form error message */}
      </form>

      {/* Live Preview */}
      <div className="max-w-96">
        <article
          className="relative cursor-pointer rounded-xl"
          onClick={() => openListing(listing)}
        >
          <ImageComponent
            h="h-96"
            img={
              listing.thumbnail ? listing.thumbnail : "/placeholderparrot.jpg"
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
                {/* Handle empty price */}
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
    </div>
  );
}
