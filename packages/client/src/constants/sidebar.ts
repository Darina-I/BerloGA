import {
  library,
  subscription,
  location,
  diagram,
  envelope,
  database,
  house,
} from "../assets/index";

export const menu = [
  {
    id: 1,
    title: "Главная",
    link: "/",
    icon: house,
  },
  {
    id: 1,
    title: "Статистика",
    link: "/statistics",
    icon: diagram,
    role: "admin",
  },
  {
    id: 2,
    title: "Запросы пользователей",
    link: "/requests",
    icon: envelope,
    role: "admin",
  },
  {
    id: 3,
    title: "База данных",
    link: "/tables",
    icon: database,
    role: "admin",
  },
  {
    id: 4,
    title: "Моя библиотека",
    link: "/library",
    icon: library,
  },
  {
    id: 5,
    title: "Пользователи",
    link: "/users",
    icon: subscription,
  },
];
