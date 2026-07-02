import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { person, time } from "../../assets";
import type {
  BoardGameItemProps,
  LibraryGamesProps,
} from "../../types/boardgame.types";
import ListItems from "./ListItems";
import Favourite from "../atoms/Favourite";
import type { RootState } from "../../store";
import Modal from "./Modal";
import { StarRating } from "./StarRating";
import Button from "../atoms/Button";
import { libraryAPI } from "../../api/userAPI";
import { loadFavouritesGameIds } from "../../utils/loadFavouriteGameIds";

interface BoardGameCardProps {
  boardgame: BoardGameItemProps | LibraryGamesProps;
  isLibrary?: boolean;
}

const BoardGameCard = ({
  boardgame,
  isLibrary = false,
}: BoardGameCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [game, setGame] = useState<BoardGameItemProps>();
  const favouriteIds = useSelector(
    (state: RootState) => state.user.favouriteGameIds,
  );
  const [isFavourite, setIsFavourite] = useState(false);
  const [isModalLikeOpen, setIsModalLikeOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    if (isLibrary) {
      setGame((boardgame as LibraryGamesProps).game);
      setRating(Number((boardgame as LibraryGamesProps).rate));
    } else {
      setGame(boardgame as BoardGameItemProps);
    }
  }, [boardgame, isLibrary]);

  useEffect(() => {
    if (game) {
      setIsFavourite(favouriteIds.includes(game.id));
    }
  }, [game, favouriteIds]);

  useEffect(() => {
    if (game) {
      setRating((prev) => (!isLibrary ? Math.floor(game.rating) : prev));
    }
  }, [game]);

  const handleClickLike = () => {
    setIsModalLikeOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalLikeOpen(false);
  };

  const handleChangeRating = (newRating: number) => {
    setNewRating(newRating);
  };

  const handleSaveRating = async () => {
    if (game?.id) {
      try {
        const result = await libraryAPI.postGameToLibrary(game.id, newRating);
        await loadFavouritesGameIds(dispatch);
        setIsModalLikeOpen(false);
      } catch (error) {
        console.error("Ошибка при добавлении игры в библиотеку: ", error);
      }
    }
  };

  const handleDeleteLike = async () => {
    if (game?.id) {
      try {
        const result = await libraryAPI.deleteGameLibrary(game.id);
        await loadFavouritesGameIds(dispatch);
        setIsModalLikeOpen(false);
      } catch (error) {
        console.error("Ошибка при удалении игры из библиотеки: ", error);
      }
    }
  };

  return (
    <>
      <div className="border-2 border-second-color rounded-lg overflow-hidden bg-second-color cursor-pointer">
        {game && (
          <>
            <div className="h-87.5 bg-white overflow-hidden relative">
              <StarRating rating={rating} />
              <Favourite isFavourite={isFavourite} onClick={handleClickLike} />
              <img
                src={game?.photo}
                className="w-full h-full object-contain"
                onClick={() => navigate(`/boardgames/${game?.id}`)}
              />
            </div>
            <div className="p-2">
              <div className="pb-2 border-b border-main-color text-lg font-bold flex justify-between">
                <p>{game?.name}</p>
                <p>{game?.age}+</p>
              </div>
              <div className="my-2 flex justify-between text-sm">
                <div className="flex gap-1">
                  <img src={person} width={15} />
                  <p>
                    {game?.min_number_players}-{game?.max_number_players} игрока
                  </p>
                </div>
                <div className="flex gap-1">
                  <img src={time} width={17} />
                  <p>{game?.time}</p>
                </div>
              </div>
              {game?.genres && <ListItems list={game.genres} />}
            </div>
          </>
        )}
      </div>

      {isModalLikeOpen && (
        <Modal
          onClose={handleCloseModal}
          title={!isFavourite ? "Поставте оценку настольной игре" : ""}
        >
          {!isFavourite ? (
            <>
              <StarRating
                rating={newRating}
                readonly={false}
                changeRating={handleChangeRating}
              />
              <Button
                content="Сохранить"
                onClick={handleSaveRating}
                className="mt-3"
              />
            </>
          ) : (
            <>
              <p>Вы уверены, что хотите удалить игру из библиотеки?</p>
              <Button
                content="Удалить"
                onClick={handleDeleteLike}
                className="mt-3"
              />
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default BoardGameCard;
