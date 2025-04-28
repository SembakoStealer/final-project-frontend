// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import CatalogPage from "./pages/MainCatalogue";
import ProfilePage from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/" element={<Navigate to="/catalog" replace />} />
      <Route path="*" element={<Navigate to="/catalog" replace />} />
    </Routes>
  );
};

export default App;
