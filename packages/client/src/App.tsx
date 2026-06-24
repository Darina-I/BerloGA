import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "./components/organisms/Header";
import Sidebar from "./components/organisms/Sidebar";
import MainPage from "./pages/MainPage";
import LibraryPage from "./pages/LibraryPage";
import BoardGamePage from "./pages/BoardGamePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

const App = () => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  const ProtectedRoutes = () => {
    if (!isAuth) {
      return <Navigate to="/login" />;
    }
    return <Outlet />; //отображает содержимое вложенных маршритов
  };
  return (
    <BrowserRouter>
      <div>
        {isAuth && <Sidebar />}
        <div className="ml-20 px-[9%] py-2">
          {isAuth && <Header />}
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/boardgames" element={<MainPage />} />
                <Route path="/boardgames/:gameId" element={<BoardGamePage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/profile" element={""} />
                <Route path="/following" element={""} />
                <Route path="/users" element={""} />
              </Route>
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
