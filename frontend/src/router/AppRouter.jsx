import {
Navigate,
Route,
Routes
} from "react-router";

import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import BarbershopPage from "../pages/BarbershopPage";
import DashboardHomePage from "../pages/dashboard/DashboardHomePage";

export default function AppRouter() {
return (
<Routes>
<Route
path="/"
element={<HomePage />}
/>

<Route
path="/register"
element={<RegisterPage />}
/>

<Route
path="/login"
element={<LoginPage />}
/>

<Route
path="/b/:slug"
element={<BarbershopPage />}
/>

<Route
path="/dashboard"
element={<DashboardHomePage />}
/>

<Route
path="*"
element={<Navigate to="/" replace />}
/>
</Routes>
);
}