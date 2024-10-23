"use client";
import React, { useState, useRef } from "react";
import Button from "../ui/button"; // Adjust the import path as necessary
import TempLogo from "../ui/logo";
import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { deleteCookie } from 'cookies-next';
import axios from 'axios';
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://127.0.0.1:5000";

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [theme, setTheme] = useState("system");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [isCodeEntryVisible, setIsCodeEntryVisible] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState("");
  const [code, setCode] = useState("");
  const [tooltipMessage, setTooltipMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
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
      const response = await axios.post(`${API_BASE_URL}/signout`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;

      deleteCookie('auth_token');

      router.push("/");
    } catch (error) {
      console.error('Signout error:', error);
    }
  }, [router]);

  return (
    
    <div className="w-full h-full justify-center">
      {/*Top bar*/}
      <nav className="sticky top-0 z-10 grid h-1/20 w-full items-center border-b border-blue-100 bg-white">
        <ul className="flex h-16 justify-between px-6 md:px-10">
          <div className="flex h-full items-center space-x-5">
            <li>
              <a href="../"><TempLogo /></a>
            </li>
            <li>
              <a href="../"><p className="text-3xl">bookit</p></a>
            </li>
          </div>
          <div className="flex h-full items-center space-x-5 justify-center">
            <h1 className = "text-4xl font-bold mx-3">Settings</h1>
          </div>
          <div className="flex h-full items-center space-x-5">
            <li className="transition-all duration-300 hover:-translate-y-1">
              <Link href="/settings">
                <Image src="/setting.png" alt="" width={32} height={32} />
              </Link>
            </li>
            <li className="transition-all duration-300 hover:-translate-y-1">
              <Link href="/profile">
                {/* use image else use placeholder */}
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className ="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300" />
                )}
              </Link>
            </li>
          </div>
        </ul>
      </nav>
      <div className = "grid grid-cols-5 h-screen">
        {/*Side bar*/}
        <div className = "col-span-1 border-r border-blue-100 bg-white grid grid-rows-4">
          <h2 className = "text-2xl ml-12 my-8">Profile:</h2>
          <h2 className = "text-2xl ml-12 my-8">Account Details:</h2>
          <h2 className = "text-2xl ml-12 my-8">Preferences:</h2>
          <h2 className = "text-2xl ml-12 my-8">Actions:</h2>
        </div>
        {/*Main info*/}
        <div className = "col-span-4 grid grid-cols-2 grid-rows-4 w-4/5">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="mx-auto my-10 h-48 w-48 rounded-full"
            />
          ) : (
            <div className="mx-auto my-10 h-48 w-48 rounded-full bg-gray-300"></div>
          )}
          <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          ref={fileInputRef}
          style={{ display: "none" }} // Hide the default file input
          />
          <div className = "my-10 col-span-1 mx-auto">
            <div className = "my-8"><Button text="Upload Photo" onClick={triggerFileInput} /></div>
            
            <div className = "my-8"><Button text="Remove Photo" onClick={() => setProfilePhoto(null)}/></div>
          </div>
          <div className = "col-span-2 grid grid-rows-2">
            <div className = "flex mx-auto">
              <label className="my-auto text-xl mx-4">Email: </label>
              <div className ="my-auto">
                {isEditingEmail ? (
                  <input
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setIsEditingEmail(false)}
                    className="border p-1 my-auto"
                    autoFocus
                  />
                ) : (
                  <div onClick={() => setIsEditingEmail(true)}>{email}</div>
                )}
              </div>
            </div>
            <div className = "flex mx-auto">
              <label className="my-auto text-xl mx-4">Phone: </label>
              <div className ="my-auto">
              {isEditingPhone ? (
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
              )}
              </div>
            </div>
          </div>
          <div className = "col-span-2 items-center flex mx-auto">
            <label className="my-auto text-xl mx-4">Theme: </label>
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
          <div className = "col-span-2 items-center flex grid grid-cols-2">
            <div className = "mx-auto"><Button text="Sign out" onClick={handleSignout} /></div>
            <div className = "mx-auto"><Button
              text="Delete Account"
              onClick={() => setIsDeleteConfirmationVisible(true)}
            /></div>

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
        </div>
      </div>
      {/* <div className="mt-4">
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
      </div> */}

      {/* <div className="flex mt-4">
        <h2 className="text-xl">Account Details</h2>
        <div className="mt-2">
          <label>Email:</label>
          {isEditingEmail ? (
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
          )}
        </div>
        <div className="mt-2">
          <label>Phone Number:</label>
          {isEditingPhone ? (
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
          )}
        </div>
      </div> */}

      {/* <div className="flex mt-4">
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
      </div> */}

      {/* <div className="flex mt-4">
        <Button text="Logout" onClick={() => alert("Logged out")} />
        <Button
          text="Delete Account"
          onClick={() => setIsDeleteConfirmationVisible(true)}
        />
      </div> */}

      {/* {isDeleteConfirmationVisible && (
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
      )} */}

      {/* {isCodeEntryVisible && (
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
      )} */}
    </div>
  );
};

export default SettingsPage;
