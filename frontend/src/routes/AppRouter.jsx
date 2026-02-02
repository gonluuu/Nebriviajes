import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

import HotelsSearchPage from "../pages/Hotels/HotelsSearchPage";
import FlightsSearchPage from "../pages/Flights/FlightsSearchPage";
import PackagesPage from "../pages/Packages/PackagesPage";
import VehiclesPage from "../pages/Vehicles/VehiclesPage";
import CruisesPage from "../pages/Cruises/CruisesPage";
import TrainsPage from "../pages/Trains/TrainsPage";
import OffersPage from "../pages/Offers/OffersPage";

import TermsPage from "../pages/Legal/TermsPage.jsx";
import PrivacyPage from "../pages/Legal/PrivacyPage.jsx";
import ContactPage from "../pages/Contact/ContactPage.jsx";

import NotFoundPage from "../pages/NotFoundPage";
import { PATHS } from "./paths";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={PATHS.HOME} element={<HomePage />} />
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.REGISTRO} element={<RegisterPage />} />

          <Route path={PATHS.VUELOS} element={<FlightsSearchPage />} />
          <Route path={PATHS.HOTELES} element={<HotelsSearchPage />} />
          <Route path={PATHS.PAQUETES} element={<PackagesPage />} />
          <Route path={PATHS.VEHICULOS} element={<VehiclesPage />} />
          <Route path={PATHS.CRUCEROS} element={<CruisesPage />} />
          <Route path={PATHS.TRENES} element={<TrainsPage />} />
          <Route path={PATHS.OFERTAS} element={<OffersPage />} />

          <Route path={PATHS.TERMINOS} element={<TermsPage />} />
          <Route path={PATHS.PRIVACIDAD} element={<PrivacyPage />} />
          <Route path={PATHS.CONTACTO} element={<ContactPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
