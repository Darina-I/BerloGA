import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../store";
import GenresTable from "../components/organisms/tables/GenresTable";
import MakersTable from "../components/organisms/tables/MakersTable";
import Tabs from "../components/molecules/Tabs";
import BoardGameTable from "../components/organisms/tables/BoardGameTable";
import UsersTable from "../components/organisms/tables/UsersTable";

const TablePage = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);
  const [currentTable, setCurrentTable] = useState("genresmakers");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, []);

  const handleClick = (type: string) => {
    setCurrentTable(type);
  };

  return (
    <div className="mt-10 space-y-5">
      <div>
        <Tabs
          list={[
            { name: "genresmakers", label: "Жанры и издательства" },
            { name: "boardgames", label: "Настольные игры" },
            { name: "users", label: "Пользователи" },
          ]}
          handleClick={handleClick}
          currentTab={currentTable}
        />
      </div>
      {currentTable === "genresmakers" && (
        <div className="flex items-start gap-7">
          <GenresTable />
          <MakersTable />
        </div>
      )}
      {currentTable === "boardgames" && <BoardGameTable />}
      {currentTable === "users" && <UsersTable />}
    </div>
  );
};

export default TablePage;
