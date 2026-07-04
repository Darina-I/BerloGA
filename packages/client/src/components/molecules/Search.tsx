import { useEffect, useState } from "react";
import type {
  BoardGameItemProps,
  LibraryGamesProps,
} from "../../types/boardgame.types";
import Input from "../atoms/Input";

interface SearchProps {
  oldList: BoardGameItemProps[];
  setList: React.Dispatch<React.SetStateAction<BoardGameItemProps[]>>;
  getValue: (item: BoardGameItemProps | LibraryGamesProps) => string;
}

const Search = ({ oldList, setList, getValue }: SearchProps) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!searchValue.trim()) {
      setList(oldList);
      return;
    }

    const lowerSearch = searchValue.toLowerCase();
    const filtered = oldList.filter((item) => {
      const value = getValue(item);
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowerSearch);
      }
    });

    setList(filtered);
  }, [searchValue, oldList]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSearchValue(e.target.value);
  };

  return (
    <form className="flex gap-3 mt-4">
      <Input
        placeholder="Поиск"
        name="search"
        value={searchValue}
        onChange={handleChange}
      />
    </form>
  );
};

export default Search;
