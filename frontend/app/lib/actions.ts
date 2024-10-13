"use server";

// ex create/update/delete listing or authenticate
import axios from "axios";

interface SignoutResponse {
  message: string;
}

interface SignoutError {
  error: string;
}

// Async function to handle signout
export const signout = async (): Promise<SignoutResponse | SignoutError> => {
  try {
    const response = await axios.post<SignoutResponse>("/api/signout");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        error: error.response.data.error || "An unknown error occurred",
      };
    } else {
      return { error: "An error occurred during signout" };
    }
  }
};
