import { libraryAPI } from "../api/userAPI";
import type { AppDispatch } from "../store";
import { setFavourite } from "../store/userSlice";
import type { LibraryGamesProps } from "../types/boardgame.types";

export const loadFavouritesGameIds = async (dispatch: AppDispatch) => {
  try {
    const res = await libraryAPI.getLibrary();

    const gameIds = res.map((item: LibraryGamesProps) => item.game.id);
    dispatch(setFavourite(gameIds));
  } catch (error) {
    console.error("Не удалось загрузить избранные игры пользователя", error);
    dispatch(setFavourite([]));
  }
};
