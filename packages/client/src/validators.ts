import type { BoardGameAttributes } from "./types/boardgame.types";

export const gameValidator = (data: BoardGameAttributes): string[] => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Поле 'name' обязательно и не может быть пустым");
  }

  if (data.photo && typeof data.photo !== "string") {
    errors.push("Поле 'photo' должно быть строкой");
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push("Поле 'content' обязательно и не может быть пустым");
  }

  if (typeof data.age !== "number" || data.age < 0) {
    errors.push("Поле 'age' должно быть неотрицательным числом");
  }

  if (
    typeof data.min_number_players !== "number" ||
    data.min_number_players < 1
  ) {
    errors.push("Поле 'min_number_players' должно быть положительным числом");
  }

  if (
    typeof data.max_number_players !== "number" ||
    (data.min_number_players &&
      data.max_number_players < data.min_number_players)
  ) {
    errors.push(
      "Поле 'max_number_players' должно быть больше или равно min_number_players",
    );
  }

  if (typeof data.maker_id !== "number" || data.maker_id <= 0) {
    errors.push("Поле 'maker_id' должно быть положительным числом");
  }

  if (data.time) {
    const timeValue = data.time.trim();
    const timeReg = /^\d{1,3}-\d{1,3}$/;

    if (!timeReg.test(timeValue)) {
      errors.push("Поле 'time' должно быть в формате, например, '30-60'");
    }
  }

  return errors;
};
