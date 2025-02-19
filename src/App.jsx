import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Components/Dashboard";
import NotFound from "./Pages/NotFound";
import { AuthProvider } from "./Context/AuthContext";
// import { Auth } from "./Pages/Auth";
import OverallDash from "./Pages/OverAllDash";
import Analytics from "./Pages/Analytics";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/auth" element={<Auth />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overall" element={<OverallDash />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
