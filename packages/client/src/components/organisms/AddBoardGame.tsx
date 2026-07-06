import { useState, useEffect } from "react";
import Modal from "../molecules/Modal";
import Input from "../atoms/Input";
import { gameValidator } from "../../validators";
import type { BoardGameAttributes } from "../../types/boardgame.types";
import { makerApi } from "../../api/makerAPI";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import { boardGameApi } from "../../api/boardGameAPI";

interface AddProps {
  onCloseModal: () => void;
}

const AddBoardGame = ({ onCloseModal }: AddProps) => {
  const [newGame, setNewGame] = useState<BoardGameAttributes>({
    name: "",
    photo: "",
    content: "",
    age: undefined,
    min_number_players: undefined,
    max_number_players: undefined,
    maker_id: undefined,
    time: "",
    pdf: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [makers, setMakers] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchMakers = async () => {
      try {
        const data = await makerApi.getAll();
        setMakers(data);
      } catch (error) {
        console.error("Ошибка при загрузке издательств: ", error);
      }
    };

    fetchMakers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (isSuccess) {
      setIsSuccess(false);
    }
    const isNumber = e.target.type === "number";
    setNewGame({
      ...newGame,
      [e.target.name]: isNumber ? Number(e.target.value) : e.target.value,
    });
  };

  const handleChangeSelect = (itemId: number) => {
    setNewGame((prev) => ({
      ...prev,
      maker_id: itemId,
    }));
  };

  const validateForm = (): boolean => {
    const errors = gameValidator(newGame as BoardGameAttributes);
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (isValid) {
      try {
        const result = await boardGameApi.postGame(newGame);
        setIsSuccess(true);
      } catch (error) {
        setErrors(["Ошибка добавления настольной игры"]);
      }
    }
  };

  return (
    <Modal title="Новая настольная игра" onClose={onCloseModal} width="w-1/2">
      <form
        className="bg-third-color w-full p-3 rounded-lg flex flex-col text-sm gap-3"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-3">
          <Input
            name="name"
            label="Название настольной игры"
            onChange={handleChange}
          />
          <Input
            name="photo"
            label="Ссылка на фотографию настольной игры"
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between items-center gap-3">
          <Input
            name="age"
            label="Возрастное ограничение"
            type="number"
            onChange={handleChange}
          />
          <Input
            name="min_number_players"
            label="Мин. игроков"
            type="number"
            onChange={handleChange}
          />
          <Input
            name="max_number_players"
            label="Макс. игроков"
            type="number"
            onChange={handleChange}
          />
          <Input
            name="time"
            label="Среднее время игры (мин.)"
            placeholder="30-60"
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-3">
          {makers && (
            <Select
              list={makers}
              label="Издательство"
              onChange={handleChangeSelect}
              valueId={newGame.maker_id}
            />
          )}
          <Input
            name="pdf"
            label="Ссылка на правила игры"
            onChange={handleChange}
          />
        </div>
        <Input
          name="content"
          label="Описание настольной игры"
          onChange={handleChange}
          isTextarea
          rows={8}
        />
        {errors.length > 0 && (
          <div className="text-red-600">
            {" "}
            {errors?.map((e) => (
              <p>{e}</p>
            ))}{" "}
          </div>
        )}
        <Button
          type="submit"
          content="Сохранить"
          className="self-center px-7"
        />
        {isSuccess && (
          <p className="text-green-600">Настольная игра успешно добавлена!</p>
        )}
      </form>
    </Modal>
  );
};

export default AddBoardGame;
