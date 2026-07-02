import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id?: number;
  nickname: string;
  email?: string;
  city?: Record<string, string | number>;
  password: string;
  social_network?: string;
  is_show_city?: boolean;
  role: "admin" | "user";
}

interface UserState {
  user: User | null;
  isAuth: boolean;
  favouriteGameIds: number[];
}

const initialState: UserState = {
  user: null,
  isAuth: false,
  favouriteGameIds: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: User;
      }>,
    ) => {
      state.user = action.payload.user;
      state.isAuth = true;
    },
    setFavourite: (state, action: PayloadAction<number[]>) => {
      state.favouriteGameIds = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const { setUser, setFavourite, logout } = userSlice.actions;
export default userSlice.reducer;
