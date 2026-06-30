export interface BoardGameItemProps {
  id: number;
  name: string;
  genres: {
    id: number;
    name: string;
  }[];
  time?: string;
  photo: string;
  rating: number;
  content: string;
  age?: number;
  min_number_players?: number;
  max_number_players?: number;
  maker: string;
  pdf?: string;
}

export interface LibraryGamesProps {
  id: number;
  game: BoardGameItemProps;
  rate: string;
}

export interface BoardGamesProps {
  list: BoardGameItemProps[];
  isLibrary?: boolean;
}
