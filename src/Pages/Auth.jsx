import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getUserProfile } from "../apis/api";

export const Auth = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/dashboard");
      async function fetchUserProfile() {
        try {
          const userData = await getUserProfile(token);
          setUser(userData);
          navigate("/dashboard");
        } catch (error) {
          console.error(error);
          setUser(null);
        }
      }
      fetchUserProfile();
    }
  }, [location, navigate, setUser]);

  return <div>Loading...</div>;
};
