import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

import ProfilePage from "../pages/Profile/ProfilePage";
import FavoritesPage from "../pages/Profile/FavoritesPage";
import { useAuthStore } from "../store/useAuthStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useEffect } from "react";

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
import { PATHS } from "./paths";

function AppRouter() {
  const { user } = useAuthStore();
  const { fetchFavorites, clearFavoritesState } = useFavoritesStore();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      clearFavoritesState();
    }
  }, [user, fetchFavorites, clearFavoritesState]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={PATHS.HOME} element={<HomePage />} />
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.REGISTRO} element={<RegisterPage />} />
          <Route path={PATHS.PERFIL} element={<ProfilePage />} />
          <Route path={PATHS.FAVORITOS} element={<FavoritesPage />} />

          <Route path={PATHS.VUELOS} element={<FlightsSearchPage />} />
          <Route path={`${PATHS.VUELOS}/:id`} element={<FlightDetailPage />} />
          <Route path={PATHS.HOTELES} element={<HotelsSearchPage />} />
          <Route path={`${PATHS.HOTELES}/:id`} element={<HotelDetailPage />} />
          <Route path={PATHS.PAQUETES} element={<PackagesPage />} />
          <Route path={`${PATHS.PAQUETES}/:id`} element={<PackageDetailPage />} />
          <Route path={PATHS.VEHICULOS} element={<VehiclesPage />} />
          <Route path={`${PATHS.VEHICULOS}/:id`} element={<VehicleDetailPage />} />
          <Route path={PATHS.CRUCEROS} element={<CruisesPage />} />
          <Route path={`${PATHS.CRUCEROS}/:id`} element={<CruiseDetailPage />} />
          <Route path={PATHS.TRENES} element={<TrainsPage />} />
          <Route path={`${PATHS.TRENES}/:id`} element={<TrainDetailPage />} />
          <Route path={PATHS.OFERTAS} element={<OffersPage />} />
          <Route path={`${PATHS.OFERTAS}/:id`} element={<OffersDetailPage />} />

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
