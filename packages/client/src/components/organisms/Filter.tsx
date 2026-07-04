import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import { genreApi } from "../../api/genreAPI";
import Checkbox from "../atoms/Checkbox";
import type { Genre } from "../../types/genre.types";

interface FilterProps {
  useFilter: (genresIds: number[]) => void;
}

const Filter = ({ useFilter }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectGenresIds, setSelectGenresIds] = useState<number[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genreId = Number(e.target.value);
    if (selectGenresIds.includes(genreId)) {
      setSelectGenresIds((prev) => prev.filter((id) => id !== genreId));
    } else {
      setSelectGenresIds((prev) => [...prev, genreId]);
    }
  };

  const handleSubmit = () => {
    useFilter(selectGenresIds);
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleReset = () => {
    useFilter([]);
    setSelectGenresIds([]);
    setIsOpen(false);
  };

  return (
    <div className={!isOpen ? "flex justify-end" : ""}>
      <div
        className={`flex justify-between items-start ${isOpen && "border rounded-lg p-4"}`}
        onSubmit={handleSubmit}
      >
        <div>
          {isOpen && (
            <>
              <p className="font-bold mb-3">
                Выберите необходимые жанры настольных игр
              </p>
              <div className="flex flex-col flex-wrap gap-1 flex-1 h-44">
                {genres?.map((g) => (
                  <Checkbox
                    key={g.id}
                    name="genre"
                    value={g.id}
                    checked={selectGenresIds.includes(g.id)}
                    onChange={handleChange}
                    label={g.name}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="space-x-3">
          {isOpen && (
            <Button
              content="Сбросить"
              onClick={handleReset}
              className="text-sm px-5"
            />
          )}
          <Button
            content={isOpen ? "Сохранить" : "Фильтр"}
            onClick={isOpen ? handleSubmit : handleClick}
            className="text-sm px-5"
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
