import { useEffect, useState, type FormEvent } from "react";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import Input from "../atoms/Input";
import { commentBlockApi } from "../../api/boardGameAPI";
import type { CommentsBlock } from "../../types/boardgame.types";
import CommentBlock from "../molecules/CommentBlock";
import MessageForUser from "../atoms/MessageForUser";

interface CommentProps {
  gameId: number;
}

const Comments = ({ gameId }: CommentProps) => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [error, setError] = useState<string>();
  const [comments, setComments] = useState<CommentsBlock[]>([]);
  const [updateComments, setUpdateComments] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentBlockApi.getAll(gameId);
        setComments(data);
      } catch (error) {
        console.log("Ошибка получения комментариев", error);
      }
    };

    fetchComments();
  }, [updateComments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const header = formData.get("header") as string;
    if (!header) {
      setError("Введите тему для обсуждения");
      return;
    }

    try {
      const result = await commentBlockApi.post(gameId, header);
      setUpdateComments((prev) => prev + 1);
      setIsOpenAdd(false);
    } catch (error) {
      console.log("Ошибка публикации темы", error);
    }
  };

  return (
    <div className="my-3 flex flex-col items-end gap-3">
      <Button content="Создать тему" onClick={() => setIsOpenAdd(true)} />
      {comments.map((c) => (
        <CommentBlock
          block={c}
          updateList={() => setUpdateComments((prev) => prev + 1)}
        />
      ))}
      {isOpenAdd && (
        <Modal title="Новая тема" onClose={() => setIsOpenAdd(false)}>
          <form className="form_style" onSubmit={handleSubmit}>
            <Input name="header" label="Что вас интересует?" isTextarea />
            {error && <MessageForUser content={error} />}
            <Button type="submit" content="Сохранить" />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Comments;
