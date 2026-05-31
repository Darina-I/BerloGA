import BoardGames from "../components/organisms/BoardGames";
import { boardgames } from "../constants/boardgames";
import Profile from "../components/organisms/Profile";

const LibraryPage = () => {
  return (
    <div>
      <p className="font-bold my-3 text-xl text-center">Моя библиотека</p>
      <Profile />
      <BoardGames list={boardgames} />
    </div>
  );
};

export default LibraryPage;
