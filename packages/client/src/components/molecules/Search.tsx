import { search } from "../../assets";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

const Search = () => {
  return (
    <form className="flex gap-3 mt-10">
      <Input placeholder="Поиск" name="search" />
      <Button content={search} isIconButton />
    </form>
  );
};

export default Search;
