import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "../api/auth.js";
import { useAuthStore } from "../store/useAuthStore.js";
import TopBar from "./components/TopBar.jsx";
import Header from "./components/Header.jsx";
import CategoryNav from "./components/CategoryNav.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "../components/common/Chatbot.jsx";

function PublicLayout() {
  const token = useAuthStore((s) => s.token);
  const setLogin = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let mounted = true;

    async function syncUser() {
      if (!token) return;

      try {
        const data = await getCurrentUser();
        if (mounted && data?.user) {
          setLogin(data.user, token);
        }
      } catch (_) {
        if (mounted) logout();
      }
    }

    syncUser();

    return () => {
      mounted = false;
    };
  }, [token, setLogin, logout]);

  return (
    <div className="app">
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default PublicLayout;
