import type { Genre } from "./models.types";

export interface User {
  id?: number;
  nickname?: string;
  email?: string;
  city_id?: number;
  social_network?: string;
  is_show_city?: boolean;
}

export interface UserForCard extends User {
  city?: {
    id: number;
    name: string;
  };
  genres?: Genre[];
  game_count: number;
}

export interface ProfileUser {
  id?: number;
  nickname?: string;
  email?: string;
  city?: {
    id: number;
    name: string;
  };
  social_network?: string;
  is_show_city?: boolean;
  genres?: Genre[];
}
