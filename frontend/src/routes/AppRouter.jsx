import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminPage from "../pages/Admin/AdminPage";

import CartPage from "../pages/Payments/CartPage";
import PaymentSuccessPage from "../pages/Payments/PaymentSuccessPage";
import PaymentCancelPage from "../pages/Payments/PaymentCancelPage";

import HotelsSearchPage from "../pages/Hotels/HotelsSearchPage";
import FlightsSearchPage from "../pages/Flights/FlightsSearchPage";
import FlightDetailPage from "../pages/Flights/FlightDetailPage";
import HotelDetailPage from "../pages/Hotels/HotelDetailPage";
import TrainDetailPage from "../pages/Trains/TrainDetailPage";
import VehicleDetailPage from "../pages/Vehicles/VehicleDetailPage";
import CruiseDetailPage from "../pages/Cruises/CruiseDetailPage";
import PackagesPage from "../pages/Packages/PackagesPage";
import PackageDetailPage from "../pages/Packages/PackageDetailPage";
import VehiclesPage from "../pages/Vehicles/VehiclesPage";
import CruisesPage from "../pages/Cruises/CruisesPage";
import TrainsPage from "../pages/Trains/TrainsPage";
import OffersPage from "../pages/Offers/OffersPage";
import OffersDetailPage from "../pages/Offers/OffersDetailPage";

import TermsPage from "../pages/Legal/TermsPage.jsx";
import PrivacyPage from "../pages/Legal/PrivacyPage.jsx";
import ContactPage from "../pages/Contact/ContactPage.jsx";

import NotFoundPage from "../pages/NotFoundPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegisterPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="admin" element={<AdminPage />} />

          <Route path="carrito" element={<CartPage />} />
          <Route path="pago/correcto" element={<PaymentSuccessPage />} />
          <Route path="pago/cancelado" element={<PaymentCancelPage />} />

          <Route path="vuelos" element={<FlightsSearchPage />} />
          <Route path="vuelos/:id" element={<FlightDetailPage />} />
          <Route path="hoteles" element={<HotelsSearchPage />} />
          <Route path="hoteles/:id" element={<HotelDetailPage />} />
          <Route path="paquetes" element={<PackagesPage />} />
          <Route path="paquetes/:id" element={<PackageDetailPage />} />
          <Route path="vehiculos" element={<VehiclesPage />} />
          <Route path="vehiculos/:id" element={<VehicleDetailPage />} />
          <Route path="cruceros" element={<CruisesPage />} />
          <Route path="cruceros/:id" element={<CruiseDetailPage />} />
          <Route path="trenes" element={<TrainsPage />} />
          <Route path="trenes/:id" element={<TrainDetailPage />} />
          <Route path="ofertas" element={<OffersPage />} />
          <Route path="ofertas/:id" element={<OffersDetailPage />} />

          <Route path="terminos" element={<TermsPage />} />
          <Route path="privacidad" element={<PrivacyPage />} />
          <Route path="contacto" element={<ContactPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
