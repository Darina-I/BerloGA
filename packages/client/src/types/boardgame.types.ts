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
  maker: {
    id: number;
    name: string;
  };
  pdf?: string;
  isFavourite: boolean;
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

//как в БД
export interface BoardGameAttributes {
  name: string;
  time?: string;
  photo: string;
  content: string;
  age?: number;
  min_number_players?: number;
  max_number_players?: number;
  maker_id?: number;
  pdf?: string;
}

//Блок комментариев
export interface CommentsBlock {
  id: number;
  game_id: number;
  header: string;
  author: {
    id: number;
    nickname: string;
  };
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: number;
  user: {
    id: number;
    nickname: string;
  };
  content: string;
  createdAt: Date;
}
