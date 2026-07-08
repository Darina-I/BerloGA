import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/organisms/Header";
import Sidebar from "./components/organisms/Sidebar";
import MainPage from "./pages/MainPage";
import LibraryPage from "./pages/LibraryPage";
import BoardGamePage from "./pages/BoardGamePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import type { RootState } from "./store";
import StatisticPage from "./pages/StatisticPage";
import RequestPage from "./pages/RequestPage";
import TablePage from "./pages/TablesPage";

const App = () => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const role = useSelector((state: RootState) => state.user.role);

  const ProtectedRoutes = () => {
    if (!isAuth) {
      return <Navigate to="/login" />;
    }
    return <Outlet />; //отображает содержимое вложенных маршрутов
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
                <Route path="/statistics" element={<StatisticPage />} />
                <Route path="/requests" element={<RequestPage />} />
                <Route path="/tables" element={<TablePage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/boardgames" element={<MainPage />} />
                <Route path="/boardgames/:gameId" element={<BoardGamePage />} />
                <Route path="/library" element={<LibraryPage />} />
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
