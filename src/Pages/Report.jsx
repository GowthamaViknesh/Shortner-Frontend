import { useState, useEffect } from "react";
import {
  getTopicAnalyticsData,
  getUrlWiseAnalyticsData,
  overAllDashData,
} from "../apis/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [data, setData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [topicData, setTopicData] = useState(null);
  const [urlData, setUrlData] = useState(null);

  useEffect(() => {
    getTopicsAndUrls();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      handleTopicAnalytics(selectedTopic);
    } else {
      setTopicData(null);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (selectedUrl) {
      handleUrlAnalytics(selectedUrl);
    } else {
      setUrlData(null);
    }
  }, [selectedUrl]);

  const getTopicsAndUrls = async () => {
    try {
      const responseData = await overAllDashData();
      setData(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTopicAnalytics = async (topic) => {
    try {
      const response = await getTopicAnalyticsData(topic);
      setTopicData(response || null);
    } catch (error) {
      console.error("Error fetching topic analytics:", error);
    }
  };

  const handleUrlAnalytics = async (shortUrl) => {
    try {
      const responseData = await getUrlWiseAnalyticsData(shortUrl);
      setUrlData(responseData || null);
    } catch (error) {
      console.error("Error fetching URL analytics:", error);
    }
  };

  const topics = [...new Set(data.map((item) => item.topic))];
  const urls = [...new Set(data.map((item) => item.customAlias))];

  let chartData = [];

  if (selectedTopic && topicData) {
    chartData = topicData.clicksByDate.map((item) => ({
      name: new Date(item.date).toLocaleDateString(),
      value: item.clickCount,
    }));
  } else if (selectedUrl && urlData) {
    chartData = urlData.clicksByDate.map((item) => ({
      name: new Date(item.date).toLocaleDateString(),
      value: item.clickCount,
    }));
  } else {
    chartData = data.map((item) => ({
      name: item.topic || item.shortUrl.substring(0, 30) + "...",
      value: item.totalClicks || 0,
    }));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        <select
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setSelectedUrl("");
          }}
          disabled={!!selectedUrl}
          className="w-64 px-4 py-2 border rounded-lg bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <select
          value={selectedUrl}
          onChange={(e) => {
            setSelectedUrl(e.target.value);
            setSelectedTopic("");
          }}
          disabled={!!selectedTopic}
          className="w-64 px-4 py-2 border rounded-lg bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All URLs</option>
          {urls.map((url) => (
            <option key={url} value={url}>
              {url.substring(0, 30)}...
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedTopic
            ? `Data for Topic: ${selectedTopic}`
            : selectedUrl
            ? `Data for URL: ${selectedUrl}`
            : "Overall Data Distribution"}
        </h2>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
