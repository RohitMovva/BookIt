"use server";

import axios from "axios";

interface SignoutResponse {
  message: string;
}

interface SignoutError {
  error: string;
}

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust this to match your Flask server's address and port
  withCredentials: true,
});

// export const signout = async (): Promise<SignoutResponse | SignoutError> => {
//   try {
//     const response = await api.post<SignoutResponse>("/api/signout");
//     return response.data;
//   } catch (error) {
//     console.error("Signout error: ", error);
//     if (axios.isAxiosError(error)) {
//       if (error.code === 'ECONNREFUSED') {
//         return { error: "Unable to connect to the server. Is it running?" };
//       }
//       if (error.response) {
//         return {
//           error: error.response.data.error || "An unknown error occurred",
//         };
//       } else if (error.request) {
//         return { error: "No response received from the server" };
//       } else {
//         return { error: error.message || "An error occurred during signout" };
//       }
//     } else {
//       return { error: "An unexpected error occurred during signout" };
//     }
//   }
// };

export const signout = async (response: any) => {
  try {
    const authResponse = await fetch(`/api/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // This is important for including cookies
    });
    return response.data;
  } catch (error) {
    return { error: "An unexpected error occurred during signout" };
    // console.error('Error:', error);
  }
};