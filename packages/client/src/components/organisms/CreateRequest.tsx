import { useState, useEffect } from "react";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import Input from "../atoms/Input";
import { requestMeApi } from "../../api/userAPI";
import MessageForUser from "../atoms/MessageForUser";

const CreateRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    details: "",
  });
  const [error, setError] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const isNumber = e.target.type === "number";
    setData({
      ...data,
      [e.target.name]: isNumber ? Number(e.target.value) : e.target.value,
    });
  };

  const validateForm = (): boolean => {
    if (!data.name) {
      setError("Введите название нужной вам игры");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (isValid) {
      try {
        const result = await requestMeApi.postRequest(data);
        setIsSuccess(true);
      } catch (error) {
        setError("Ошибка отправки запроса");
      }
    }
  };

  return (
    <div className="text-sm flex justify-end">
      <Button
        content="Оставить заявку на добавление настольной игры"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <Modal
          title="Заявка на добавление игры"
          onClose={() => setIsOpen(false)}
        >
          <form
            className="bg-white rounded-lg w-full p-3 flex flex-col justify-center items-center gap-2"
            onSubmit={handleSubmit}
          >
            <Input label="Название игры" name="name" onChange={handleChange} />
            <Input
              label="Детали заявки"
              name="details"
              isTextarea
              onChange={handleChange}
              rows={4}
            />
            {error && <MessageForUser content={error} isError />}
            <Button type="submit" content="Отправить" className="px-5" />
            {isSuccess && (
              <MessageForUser content="Запрос успешно отправлен!" />
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CreateRequest;
