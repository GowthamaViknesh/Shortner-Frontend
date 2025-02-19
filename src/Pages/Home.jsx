import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserProfile } from "../apis/api";
import { useAuth } from "../Context/AuthContext";
import { Send } from "lucide-react";

const Home = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // ✅ Handle token from OAuth Redirect (Google Login)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      console.log("Token received:", token);
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/"); // Remove token from URL
      fetchUserProfile(token);
    }
  }, [location]);

  // ✅ Fetch User Profile
  const fetchUserProfile = useCallback(
    async (token) => {
      try {
        const userData = await getUserProfile(token);
        if (userData) {
          setUser(userData);
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching user profile", error);
        setUser(null);
      }
    },
    [setUser, navigate]
  );

  // ✅ Auto-login if token is in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    }
  }, [fetchUserProfile]);

  // ✅ Handle Google Login
  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href =
      "https://the-alter-office.onrender.com/api/auth/google";
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Send className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-600">ShortnerApp</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Transform Your Long URLs into
          <span className="text-blue-600"> Powerful Links</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track, manage, and optimize your links with our powerful URL
          shortening platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Quick Shortening</h3>
            <p className="text-gray-600">
              Shorten URLs instantly with just one click
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Analytics</h3>
            <p className="text-gray-600">Track clicks and visitor insights</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Custom Links</h3>
            <p className="text-gray-600">Create branded and memorable URLs</p>
          </div>
        </div>

        <div className="space-y-6">
          {user ? (
            <>
              <p className="text-lg text-gray-700">Welcome, {user.name}!</p>
              <button
                className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-700">
                Get started by logging in with your Google account
              </p>
              <button
                className="flex items-center justify-center gap-3 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 mx-auto group"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-8">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Home;
