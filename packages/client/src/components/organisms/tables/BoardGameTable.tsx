import { useEffect, useState } from "react";
import type { BoardGameItemProps } from "../../../types/boardgame.types";
import { boardGameApi } from "../../../api/boardGameAPI";
import ListItems from "../../molecules/ListItems";
import Link from "../../atoms/Link";
import Button from "../../atoms/Button";
import Modal from "../../molecules/Modal";
import Select from "../../atoms/Select";
import { genreApi } from "../../../api/genreAPI";
import type { Genre } from "../../../types/models.types";

const BoardGameTable = () => {
  const [games, setGames] = useState<BoardGameItemProps[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [openGenresId, setOpenGenresId] = useState<number>();
  const [updateList, setUpdateList] = useState(0);

  const [selectGenreAdd, setSelectGenreAdd] = useState<number>();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await boardGameApi.getAll();
        setGames(data);
      } catch (error) {
        console.error("Ошибка при загрузке настольных игр: ", error);
      }
    };

    fetchGames();
  }, [updateList]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await genreApi.getAll();
        setGenres(data);
      } catch (error) {
        console.error("Ошибка при загрузке жанров: ", error);
      }
    };

    fetchGenres();
  }, []);

  const handleDeleteGenre = async (gameId: number, genreId: number) => {
    try {
      const result = await boardGameApi.deleteGenre(gameId, genreId);
      setUpdateList((prev) => prev + 1);
    } catch (error) {
      console.log("Ошибка удаления жанра");
    }
  };

  const handleAddGenre = async (gameId: number) => {
    if (selectGenreAdd) {
      try {
        const result = await boardGameApi.postGenre(gameId, selectGenreAdd);
        setUpdateList((prev) => prev + 1);
      } catch (error) {
        console.log("Ошибка добавления жанра");
      }
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-main-color bg-white">
      <table className="w-full divide-y divide-main-color table-auto">
        <thead className="bg-second-color">
          <tr>
            <th className="px-6 py-4 text-xs font-medium uppercase"></th>
            <th className="px-6 py-4 text-xs font-medium uppercase">Фото</th>

            <th className="px-6 py-4 text-xs font-medium uppercase">
              Название
            </th>
            <th className="px-6 py-4 text-xs font-medium uppercase">Жанры</th>
            <th className="px-6 py-4 text-xs font-medium uppercase">
              Возрастное ограничение
            </th>
            <th className="px-6 py-4 text-xs font-medium uppercase">
              Количество игроков
            </th>
            <th className="px-6 py-4 text-xs font-medium uppercase">
              Издательство
            </th>
            <th className="px-6 py-4 text-xs font-medium uppercase">
              Время игры
            </th>
            <th className="px-6 py-4 text-xs font-medium uppercase">
              Правила игры
            </th>
            <th className="px-6 py-4 text-xs font-medium uppercase"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-second-color">
          {games?.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{index + 1}</td>
              <td className="px-6 py-4">
                <img src={item?.photo} width={150} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>

              <td className="px-6 py-4 text-xs">
                <ListItems list={item.genres} />
              </td>

              <td className="px-6 py-4 text-center">{item.age}+</td>

              <td className="px-6 py-4 text-center">
                {item.min_number_players}-{item.max_number_players} игрока
              </td>

              <td className="px-6 py-4 text-center">{item.maker.name}</td>

              <td className="px-6 py-4 text-center">{item.time} мин</td>

              <td className="px-6 py-4 text-center">
                {item.pdf ? <Link link={item.pdf} content="pbf" isOut /> : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs">
                <Button
                  content="Редактировать жанры"
                  onClick={() => setOpenGenresId(item.id)}
                />
                {openGenresId === item.id && (
                  <Modal
                    title="Редактирование списка жанров"
                    onClose={() => setOpenGenresId(undefined)}
                  >
                    <ListItems
                      list={item.genres}
                      isCanEdit
                      onDelete={(genreId) =>
                        handleDeleteGenre(item.id, genreId)
                      }
                    />
                    <div className="bg-white p-3 rounded-lg w-full mt-5 text-base flex flex-col items-center gap-3">
                      <Select
                        list={genres}
                        onChange={(id: number) => setSelectGenreAdd(id)}
                        valueId={selectGenreAdd}
                        placeholder="Выберите необходимый жанр"
                      />
                      <Button
                        content="Добавить"
                        className="px-5"
                        onClick={() => handleAddGenre(item.id)}
                      />
                    </div>
                  </Modal>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardGameTable;
