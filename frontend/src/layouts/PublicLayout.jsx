import { Outlet } from "react-router-dom";
import TopBar from "./components/TopBar.jsx";
import Header from "./components/Header.jsx";
import CategoryNav from "./components/CategoryNav.jsx";
import Footer from "./components/Footer.jsx";

function PublicLayout() {
  return (
    <div className="app">
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;