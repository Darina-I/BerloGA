import { useEffect, useState } from "react";
import { makerApi } from "../../../api/makerAPI";
import type { Maker } from "../../../types/models.types";
import { trash } from "../../../assets";
import Button from "../../atoms/Button";
import Modal from "../../molecules/Modal";
import Input from "../../atoms/Input";
import MessageForUser from "../../atoms/MessageForUser";

const MakersTable = () => {
  const [makers, setMakers] = useState<Maker[]>([]);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [errorAdd, setErrorAdd] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [updateList, setUpdateList] = useState(0);

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
  }, [updateList]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    if (!name) {
      setErrorAdd("Введите название издательства");
      return;
    }

    try {
      const result = await makerApi.post(name);
      setIsSuccess(true);
      setUpdateList((prev) => prev + 1);
    } catch (error) {
      console.error("Ошибка при добавлении издательства: ", error);
      setErrorAdd("Ошибка при добавлении издательства");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await makerApi.delete(id);
      setUpdateList((prev) => prev + 1);
    } catch (error) {
      console.error("Ошибка при удалении издательства: ", error);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-main-color bg-white w-full">
      <table className="w-full divide-y divide-main-color table-auto">
        <thead className="bg-second-color">
          <tr>
            <th
              className="px-6 py-4 text-xs font-medium uppercase text-start"
              colSpan={2}
            >
              Таблица издательств
            </th>

            <th className="text-xs font-medium uppercase w-1/8">
              <Button content="Добавить" onClick={() => setIsOpenAdd(true)} />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-second-color">
          {makers?.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-medium">{index + 1}</td>

              <td className="px-6 py-3 whitespace-nowrap">{item.name}</td>
              <td className="px-6 py-3 flex items-center justify-center">
                <img
                  src={trash}
                  width={35}
                  className="cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isOpenAdd && (
        <Modal
          title="Добавление нового издательства"
          onClose={() => setIsOpenAdd(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="form_style items-center gap-3"
          >
            <Input name="name" placeholder="Наименование издательства" />
            {errorAdd && <MessageForUser content={errorAdd} isError />}
            <Button type="submit" content="Добавить" />
            {isSuccess && (
              <MessageForUser content="Издательство успешно добавлен!" />
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MakersTable;
