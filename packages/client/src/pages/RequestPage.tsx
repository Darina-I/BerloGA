import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import ListRequest from "../components/organisms/ListRequest";
import Button from "../components/atoms/Button";
import AddBoardGame from "../components/organisms/AddBoardGame";

const RequestPage = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);
  const [isOpenAddGame, setIsOpenAddGame] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, []);
  return (
    <div className="mt-10 flex flex-col">
      <Button
        content="Добавить игру"
        className="self-end px-5 mb-3"
        onClick={() => setIsOpenAddGame(true)}
      />
      <ListRequest />
      {isOpenAddGame && (
        <AddBoardGame onCloseModal={() => setIsOpenAddGame(false)} />
      )}
    </div>
  );
};

export default RequestPage;
