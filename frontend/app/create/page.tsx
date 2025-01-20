"use client";

import { useState, useEffect } from "react";
import { Condition, Listing } from "../lib/definitions";
import { createListing } from "../lib/data";
import Image from "next/image";
import ImageComponent from "../ui/image";
import Input from "../ui/input";
import Textarea from "../ui/text-area";
import StyledSelect from "../ui/select";
import { useRouter } from "next/navigation";
import TopBar from "../ui/home/top-bar";
import Button from "../ui/button";

// Add helper functions for image preview
const createPreviewUrl = (file: File | string): string => {
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
  return file;
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
    thumbnail_image: "/placeholderparrot.jpg", // Default placeholder
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
  const [previewUrls, setPreviewUrls] = useState<{
    thumbnail: string;
    others: string[];
  }>({
    thumbnail: "/placeholderparrot.jpg",
    others: [],
  });

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

    if (listing.phone && !phoneRegex.test(listing.phone)) {
      setPhoneError(true);
      setFormError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      await createListing(listing);
      router.push("/");
    } catch (error) {
      setFormError("Error creating listing. Please try again.");
      console.error("Error creating listing:", error);
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

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      setListing(prev => ({
        ...prev,
        thumbnail_image: file
      }));
      
      setPreviewUrls(prev => ({
        ...prev,
        thumbnail: previewUrl
      }));
    }
  };

  const handleOtherImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      
      setListing(prev => ({
        ...prev,
        other_images: files
      }));
      
      setPreviewUrls(prev => ({
        ...prev,
        others: newPreviewUrls
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

  useEffect(() => {
    return () => {
      if (previewUrls.thumbnail !== "/placeholderparrot.jpg") {
        URL.revokeObjectURL(previewUrls.thumbnail);
      }
      previewUrls.others.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
            <p>Upload Images: </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="file-input file-input-bordered te w-full"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleOtherImagesChange}
              className="file-input file-input-bordered w-full"
            />
            <Button
              textColor="text-white btn btn-primary w-full text-2xl"
              onClick={handleSubmit}
              text="Create"
            />
            {formError && <p className="text-red-500">{formError}</p>}{" "}
          </form>
        </div>

      {/* Live Preview */}
      <div className="w-full max-w-96">
          <h2>Live Preview</h2>
          <article
            className="relative cursor-pointer rounded-xl"
            onClick={() => {
              setSelectedListing({
                ...listing,
                thumbnail_image: previewUrls.thumbnail,
                other_images: previewUrls.others
              });
              setIsPopupOpen(true);
            }}
          >
            <ImageComponent
              h="h-96"
              img={previewUrls.thumbnail}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closePopup}>
          <div className="relative flex h-screen w-screen flex-col overflow-y-auto rounded-lg bg-white py-6 shadow-lg md:mx-20 md:w-full md:flex-row md:overflow-hidden lg:mx-40">
            <div className="order-last mx-4 flex-col justify-items-center md:order-first md:mx-10 md:w-1/2 md:overflow-y-auto">
              <div className="mb-6 h-96 w-full">
                <ImageComponent
                  w="w-full"
                  h="h-full"
                  img={previewUrls.thumbnail}
                />
              </div>
              {previewUrls.others.map((url, index) => (
                <div className="mb-6" key={`preview-${index}`}>
                  <ImageComponent w="w-full" h="h-96" img={url} />
                </div>
              ))}
            </div>
              {/* Text (right) */}
              <div className="grid w-1/2 gap-2 p-6 md:border-l md:border-black md:px-12 md:overflow-y-auto">
                <div>
                  <h2 className="mb-2 text-5xl font-semibold">
                    {selectedListing.title}
                  </h2>
                  <p className="mb-4 text-lg text-gray-700">
                    {selectedListing.description}
                  </p>
                  <div className="flex items-center gap-8">
                    <p className="w-fit rounded-full bg-blue-800 px-3 py-3 text-center text-xl text-white">
                      ${selectedListing.price}
                    </p>
                    <p className="w-fit rounded-full bg-blue-800 px-3 py-3 text-center text-xl text-white">
                      {selectedListing.condition}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-3xl">Class:</p>
                  <p className="text-2xl">{selectedListing.class}</p>
                </div>
                <div>
                  <p className="text-3xl">Condition:</p>
                  <p className="text-2xl">{selectedListing.condition}</p>
                </div>
                <div className="">
                  <p className="text-3xl">Contact Information</p>
                  <div>
                    <p className="text-2xl text-gray-700">
                      Phone: {selectedListing.phone}
                    </p>
                    <p className="text-2xl text-gray-700">
                      Email: {selectedListing.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
