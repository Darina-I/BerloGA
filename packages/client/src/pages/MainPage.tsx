import { boardgames } from "../constants/boardgames";
import BoardGames from "../components/organisms/BoardGames";

const MainPage = () => {
  return (
    <div className="mt-7">
      <BoardGames list={boardgames} />
    </div>
  );
};

export default MainPage;
