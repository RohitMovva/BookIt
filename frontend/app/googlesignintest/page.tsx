// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// // Define the type for the Google Sign-In response
// interface GoogleSignInResponse {
//   credential: string; // or any other properties you expect
// }

// export default function Page() {
//   const [message, setMessage] = useState<string>("");
//   // const [items, setItems] = useState<Item[]>([]);
//   const [newItem, setNewItem] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   useEffect(() => {
//     // Create the Google Sign-In script
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;

//     // Append the script to the document body
//     document.body.appendChild(script);
//     // Cleanup: Remove the script when the component unmounts
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const sendCredentials = (response: GoogleSignInResponse) => {
//     axios
//       .post("http://127.0.0.1:5000/credentials", { name: response })
//       .then((response) => {
//         // setItems((prevItems) => [...prevItems, response.data.item]);
//         // setNewItem("");
//       })
//       .catch((error) => {
//         console.error("Error adding item:", error);
//         setError("Error adding new item.");
//       });
//   };

//   useEffect(() => {
//     // Initialize the Google Sign-In after the script is loaded
//     const initializeGoogleSignIn = () => {
//       if (window.google) {
//         window.google.accounts.id.initialize({
//           client_id:
//             "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com",
//           callback: (response: GoogleSignInResponse) => {
//             // Handle the response here
//             sendCredentials(response);
//           },
//         });
//       }
//     };

//     // Check if the google object is available after the script is loaded
//     if (window.google) {
//       initializeGoogleSignIn();
//     } else {
//       // Try initializing after a short delay
//       const interval = setInterval(() => {
//         if (window.google) {
//           clearInterval(interval);
//           initializeGoogleSignIn();
//         }
//       }, 100);
//     }
//   }, []);

//   return (
//     <>
//       <div
//         id="g_id_onload"
//         data-client_id="181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"
//         data-context="signin"
//         data-ux_mode="popup"
//         data-auto_prompt="false"
//       ></div>

//       <div
//         className="g_id_signin"
//         data-type="standard"
//         data-shape="rectangular"
//         data-theme="outline"
//         data-text="signin_with"
//         data-size="large"
//         data-logo_alignment="left"
//       ></div>
//     </>
//   );
// }
