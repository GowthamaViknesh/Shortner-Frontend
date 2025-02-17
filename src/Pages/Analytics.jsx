import { useEffect, useState } from "react";
import {
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Link, Users, Monitor, MousePointerClick } from "lucide-react";
import { getUserAnalyticsData } from "../apis/api";

// eslint-disable-next-line react/prop-types
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

// eslint-disable-next-line react/prop-types
const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const Analytics = () => {
  const [data, setData] = useState({
    totalUrls: 0,
    totalClicks: 0,
    uniqueUsers: 0,
    clicksByDate: [],
    osType: [],
    deviceType: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserAnalyticsData();
        setData(response || {});
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  const formattedClicksByDate =
    data.clicksByDate?.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      clicks: item.clickCount,
    })) || [];

  return (
    <div className="max-w-full mx-auto p-6 space-y-8">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard title="Total URLs" value={data.totalUrls || 0} icon={Link} />
        <StatCard
          title="Total Clicks"
          value={data.totalClicks || 0}
          icon={MousePointerClick}
        />
        <StatCard
          title="Unique Users"
          value={data.uniqueUsers || 0}
          icon={Users}
        />
        <StatCard
          title="Device Types"
          value={data.deviceType?.length || 0}
          icon={Monitor}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
        {/* Clicks Over Time */}
        <ChartCard title="Clicks Over Time">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedClicksByDate}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* OS Distribution */}
        <ChartCard title="Operating System Distribution">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.osType || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="osName" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="uniqueClicks"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Device Types */}
        <ChartCard title="Device Type Distribution">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.deviceType || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="deviceName" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="uniqueClicks"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
