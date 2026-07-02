import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; //автоматически выводит тип всего store
export type AppDispatch = typeof store.dispatch; //автоматически выводит тип для функции dispatch моего store
