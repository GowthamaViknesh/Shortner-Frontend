import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getUserProfile } from "../apis/api";

export const Auth = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      async function fetchUserProfile() {
        try {
          const userData = await getUserProfile(token);
          setUser(userData);
          navigate("/dashboard", { replace: true }); // ✅ Navigate properly
        } catch (error) {
          console.error(error);
          setUser(null);
        }
      }

      fetchUserProfile();
    } else {
      navigate("/"); // If no token, go home
    }
  }, [location, navigate, setUser]);

  return <div>Loading...</div>;
};
