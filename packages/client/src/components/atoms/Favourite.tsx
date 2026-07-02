import { heartFull, heartLine } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../../store";
import { libraryAPI } from "../../api/userAPI";
import { loadFavouritesGameIds } from "../../utils/loadFavouriteGameIds";
import Modal from "../molecules/Modal";
import { StarRating } from "../molecules/StarRating";
import Button from "./Button";

interface FavouriteProps {
  gameId: number;
  isInCard?: boolean;
}

const Favourite = ({ gameId, isInCard = false }: FavouriteProps) => {
  const dispatch = useDispatch();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isModalLikeOpen, setIsModalLikeOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);

  const favouriteIds = useSelector(
    (state: RootState) => state.user.favouriteGameIds,
  );
  useEffect(() => {
    if (gameId) {
      setIsFavourite(favouriteIds.includes(gameId));
    }
  }, [gameId, favouriteIds]);

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
    if (gameId) {
      try {
        const result = await libraryAPI.postGameToLibrary(gameId, newRating);
        await loadFavouritesGameIds(dispatch);
        setIsModalLikeOpen(false);
      } catch (error) {
        console.error("Ошибка при добавлении игры в библиотеку: ", error);
      }
    }
  };

  const handleDeleteLike = async () => {
    if (gameId) {
      try {
        const result = await libraryAPI.deleteGameLibrary(gameId);
        await loadFavouritesGameIds(dispatch);
        setIsModalLikeOpen(false);
      } catch (error) {
        console.error("Ошибка при удалении игры из библиотеки: ", error);
      }
    }
  };

  return (
    <div className={`${!isInCard ? "relative" : ""}`}>
      <div
        className={`cursor-pointer ${!isInCard ? "absolute top-1 right-1" : ""}`}
        onClick={handleClickLike}
      >
        <img
          src={isFavourite ? heartFull : heartLine}
          width={isInCard ? 30 : 25}
        />
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
    </div>
  );
};

export default Favourite;
