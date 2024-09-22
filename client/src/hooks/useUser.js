import { useCallback } from "react";
import useAuth from "./useAuth";
import useAxiosPrivate from "./usePrivate";

export default function useUser() {
  const { isLoggedIn, setUser } = useAuth();
  const axiosPrivateInstance = useAxiosPrivate();

  const getUser = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const { data } = await axiosPrivateInstance.get("auth/user");
      setUser(data);
      return data; // Return the user data so you can use it in the Home component
    } catch (error) {
      console.log("Error fetching user data:", error.response);
      return null;
    }
  }, [isLoggedIn, axiosPrivateInstance, setUser]); // Dependencies for useCallback

  return getUser;
}
