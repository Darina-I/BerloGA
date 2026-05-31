export interface BoardGameItemProps {
  id: number;
  name: string;
  genres: string[];
  time: string;
  photo: string;
  rating_in: number;
  content: string;
  age: number;
  min_number_players: number;
  max_number_players: number;
  maker: string;
  pdf: string;
}

export interface BoardGamesProps {
  list: BoardGameItemProps[];
}
