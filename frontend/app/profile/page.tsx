"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import { useCallback } from "react";
import { deleteCookie } from "cookies-next";
import axios from "axios";
import Input from "../ui/input";
import TopBar from "../ui/home/top-bar";

const API_BASE_URL = "http://127.0.0.1:5000";

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("");
  const [theme, setTheme] = useState("system");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  // const [isEditingEmail, setIsEditingEmail] = useState(false);
  // const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [isCodeEntryVisible, setIsCodeEntryVisible] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState("");
  const [code, setCode] = useState("");
  const [tooltipMessage, setTooltipMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input
  const [phoneError, setPhoneError] = useState(false);

  const phoneRegex = /^[0-9]{10}$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handlePhoneBlur = () => {
    if (phone && !phoneRegex.test(phone)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendCode = () => {
    // Implement your email code sending logic here
  };

  const handleDeleteAccount = () => {
    sendCode(); // Call the function to send code
    setIsDeleteConfirmationVisible(false); // Close confirmation popup
    setIsCodeEntryVisible(true); // Open code entry popup
  };

  const handleCodeSubmit = () => {
    const correctCode = "123456"; // Simulated correct code
    if (code === correctCode) {
      // Add your delete account logic here
      alert("Account deleted");
      setIsCodeEntryVisible(false);
      setEmailToDelete("");
    } else {
      setTooltipMessage("Code is incorrect");
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const router = useRouter();

  const handleSignout = useCallback(async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/signout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;

      deleteCookie("auth_token");

      router.push("/");
    } catch (error) {
      console.error("Signout error:", error);
    }
  }, [router]);

  return (
    <>
      <TopBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="mt-4">
          <h2 className="text-xl">Profile Photo</h2>
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="h-32 w-32 rounded-full"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-300"></div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the default file input
          />
          <Button text="Upload Photo" onClick={triggerFileInput} />
          <button className="ml-2" onClick={() => setProfilePhoto(null)}>
            Remove Photo
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-xl">Contact</h2>
          <div className="mt-2">
            {/* <label>Email:</label>
          <Input
            type="text"
            value={email}
            onChange={handleEmailChange}
          /> */}
            {/* {isEditingEmail ? (
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => setIsEditingEmail(false)}
              className="border p-1"
              autoFocus
            />
          ) : (
            <div onClick={() => setIsEditingEmail(true)}>{email}</div>
          )} */}
          </div>
          <div className="mt-2">
            <Input
              type="number"
              name="phone"
              placeholder="Phone"
              className={`input w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                phoneError ? "border-red-500" : "input-bordered"
              }`}
              value={phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
            />
            {phoneError && <p className="text-red-500">Invalid phone number</p>}{" "}
            {/* {isEditingPhone ? (
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => setIsEditingPhone(false)}
              className="border p-1"
              autoFocus
            />
          ) : (
            <div onClick={() => setIsEditingPhone(true)}>{phone}</div>
          )} */}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl">Preferences</h2>
          <div>
            <label>Theme:</label>
            <div className="flex space-x-2">
              <button
                className={`border p-2 ${theme === "system" ? "bg-gray-200" : ""}`}
                onClick={() => handleThemeChange("system")}
              >
                Sync with System
              </button>
              <button
                className={`border p-2 ${theme === "light" ? "bg-gray-200" : ""}`}
                onClick={() => handleThemeChange("light")}
              >
                Light
              </button>
              <button
                className={`border p-2 ${theme === "dark" ? "bg-gray-200" : ""}`}
                onClick={() => handleThemeChange("dark")}
              >
                Dark
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button text="Sign out" onClick={handleSignout} />
          <Button
            text="Delete Account"
            onClick={() => setIsDeleteConfirmationVisible(true)}
          />
        </div>

        {isDeleteConfirmationVisible && (
          <div className="mt-4 rounded border border-red-500 p-2">
            <h3>Are you sure you want to delete your account?</h3>
            <div className="mt-2">
              <Button text="Yes" onClick={handleDeleteAccount} />
              <Button
                text="Cancel"
                onClick={() => setIsDeleteConfirmationVisible(false)}
                bgColor="bg-gray-300"
              />
            </div>
          </div>
        )}

        {isCodeEntryVisible && (
          <div className="mt-4 rounded border border-yellow-500 p-2">
            <h3>Enter the code sent to your email:</h3>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-1"
            />
            <div className="mt-2">
              <Button text="Submit" onClick={handleCodeSubmit} />
              <Button
                text="Cancel"
                onClick={() => setIsCodeEntryVisible(false)}
                bgColor="bg-gray-300"
              />
            </div>
            {tooltipMessage && <p className="text-red-500">{tooltipMessage}</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsPage;
