import { useNavigate } from "react-router-dom";
import type { UserForCard } from "../../types/user.types";
import ListItems from "./ListItems";

interface CardProps {
  user: UserForCard;
}

const UserCard = ({ user }: CardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/library/${user.id}`);
  };
  return (
    <div className="w-full bg-second-color p-3 rounded-lg flex flex-col justify-between">
      <div>
        <div
          className="flex w-full items-center justify-between bg-white p-2 rounded-lg cursor-pointer"
          onClick={handleClick}
        >
          <p className="text-xl font-semibold">{user.nickname}</p>
          <div className="flex flex-col items-center">
            <p className="text-sm">Библиотека</p>
            <p className="bg-main-color text-white py-1 px-3 rounded-lg">
              {user.game_count} игр
            </p>
          </div>
        </div>
        {user?.city && user.is_show_city && (
          <div className="flex items-center gap-2 mb-10 mt-2">
            <p>Город:</p>
            <div className="flex-1 h-[0.5px] bg-main-color" />
            <p>{user.city.name}</p>
          </div>
        )}
      </div>
      <div className="text-sm space-y-1">
        {user.genres && user.genres.length > 0 && (
          <>
            <p>Любимые жанры</p>
            <ListItems list={user.genres} />
          </>
        )}
      </div>
    </div>
  );
};

export default UserCard;
