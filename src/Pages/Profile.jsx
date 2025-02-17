export const Profile = ({ user, handleLogout }) => {
  if (!user) return <p>Loading...</p>;

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-10">
        <div className="flex flex-col items-center pb-15">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={user?.picture || "/default-avatar.png"}
            alt={user?.displayName || "User Profile"}
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {user?.displayName || "Unknown User"}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Created At: {createdAt}
          </span>
          <button
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
