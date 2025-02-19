import { useState, useEffect, useCallback } from "react";
import { Link, Trash2, Copy } from "lucide-react";
import { createUrl, deleteUrlData, overAllDashData } from "../apis/api";

const OverallDash = () => {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [topic, setTopic] = useState("");
  const [urls, setUrls] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchUrls = useCallback(async () => {
    try {
      const response = await overAllDashData();
      if (response && Array.isArray(response.data)) {
        setUrls(response.data);
      } else {
        console.error("Data fetched is not an array", response);
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls, lastUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    try {
      const newUrl = await createUrl({ longUrl, customAlias, topic });
      if (newUrl) {
        setLastUpdate(Date.now());
      }

      setLongUrl("");
      setCustomAlias("");
      setTopic("");
    } catch (error) {
      console.error("Error creating URL:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteUrlData(id);
      if (result) {
        setLastUpdate(Date.now());
      } else {
        console.error("Error deleting URL");
      }
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-2 mb-4">
          <Link className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-semibold">Shorten Your URL</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter your long URL here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="Custom Alias (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Shorten
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 w-[1320px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link className="text-blue-600 w-6 h-6" />
            <h2 className="text-xl font-semibold">Your Shortened URLs</h2>
          </div>
          <div className="text-sm text-gray-600">Total URLs: {urls.length}</div>
        </div>

        <div className="overflow-x-auto w-[1280px]">
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-gray-50 w-full">
              <tr>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase w-2/6">
                  Original URL
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase w-3/6">
                  Short URL
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Alias
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Topic
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase w-1/12">
                  Clicks
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Created On
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase w-1/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 w-full">
              {urls.map((url) => (
                <tr key={url.id} className="hover:bg-gray-50 w-full">
                  <td className="px-2 py-2 truncate">{url.longUrl}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {url.shortUrl}
                      </a>
                      <button
                        onClick={() => handleCopy(url.shortUrl)}
                        className="text-gray-600 hover:text-blue-600"
                        title="Copy URL"
                      >
                        <Copy className="w-12 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-2">{url.customAlias || "-"}</td>
                  <td className="px-2 py-2">{url.topic || "-"}</td>
                  <td className="px-1 py-2 text-center">{url.clicks}</td>
                  <td className="px-2 py-2">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleDelete(url._id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverallDash;
