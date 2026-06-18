interface BoardGameAttributes {
  id?: number;
  name: string;
  photo: string;
  rating: number;
  content: string;
  age: number;
  min_number_players: number;
  max_number_players: number;
  maker_id: number;
}

export const gameValidator = (data: BoardGameAttributes): string[] => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Поле 'name' обязательно и не может быть пустым");
  }

  if (data.photo && typeof data.photo !== "string") {
    errors.push("Поле 'photo' должно быть строкой");
  }

  if (typeof data.rating !== "number" || data.rating < 0 || data.rating > 5) {
    errors.push("Поле 'rating' должно быть числом от 0 до 5");
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
    data.max_number_players < data.min_number_players
  ) {
    errors.push(
      "Поле 'max_number_players' должно быть больше или равно min_number_players",
    );
  }

  if (typeof data.maker_id !== "number" || data.maker_id <= 0) {
    errors.push("Поле 'maker_id' должно быть положительным числом");
  }

  return errors;
};
