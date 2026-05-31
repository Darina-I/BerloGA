import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/organisms/Header";
import Sidebar from "./components/organisms/Sidebar";
import MainPage from "./pages/MainPage";
import LibraryPage from "./pages/LibraryPage";
import BoardGamePage from "./pages/BoardGamePage";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Sidebar />
        <div className="ml-20 px-[9%] py-2">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/boardgames" element={<MainPage />} />
              <Route path="/boardgames/:gameId" element={<BoardGamePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/profile" element={""} />
              <Route path="/following" element={""} />
              <Route path="/users" element={""} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
