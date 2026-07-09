import { useState, type FormEvent } from "react";
import type { CommentsBlock } from "../../types/boardgame.types";
import { arrow } from "../../assets";
import Button from "../atoms/Button";
import Modal from "./Modal";
import Input from "../atoms/Input";
import { commentBlockApi } from "../../api/boardGameAPI";
import MessageForUser from "../atoms/MessageForUser";

interface CommentBlockProps {
  block: CommentsBlock;
  updateList: () => void;
}

const CommentBlock = ({ block, updateList }: CommentBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("content") as string;

    try {
      const result = await commentBlockApi.postComment(block.id, content);
      updateList();
      setIsOpenAdd(false);
    } catch {
      setError("Ошибка публикации комментария");
    }
  };

  return (
    <div className="bg-[#BADFF5] w-full p-3 rounded-lg ">
      <div className="flex justify-between">
        <div className="space-y-1">
          <p className="font-bold">{block.header}</p>
          <p className="text-xs">
            {block.author.nickname} |{" "}
            {new Date(block.createdAt).toLocaleDateString("ru-RU")}
          </p>
        </div>
        <img
          className={`${isOpen && "rotate-180"} cursor-pointer`}
          src={arrow}
          width={30}
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>
      {isOpen && (
        <>
          <hr className="my-2 border-main-color" />
          <div className="text-white text-xs flex justify-end">
            <Button
              content="Добавить комментарий"
              className="p-0.5"
              onClick={() => setIsOpenAdd(true)}
            />
          </div>
          {block.comments?.length > 0 ? (
            <div className="space-y-3 mt-3">
              {block.comments.map((c) => (
                <div className="space-y-1 bg-white p-2 rounded-lg flex justify-between">
                  <p className="font-bold">{c.content}</p>
                  <p className="text-xs">
                    {c.user.nickname} |{" "}
                    {new Date(c.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div>Комментариев нет</div>
          )}
        </>
      )}
      {isOpenAdd && (
        <Modal title="Новый комментарий" onClose={() => setIsOpenAdd(false)}>
          <form className="form_style items-center" onSubmit={handleSubmit}>
            <Input name="content" isTextarea label="Комментарий" />
            {error && <MessageForUser content={error} />}
            <Button type="submit" content="Отправить" />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CommentBlock;
