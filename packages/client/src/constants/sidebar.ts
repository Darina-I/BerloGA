import {
  library,
  subscription,
  location,
  diagram,
  envelope,
} from "../assets/index";

export const menu = [
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
    title: "Моя библиотека",
    link: "/library",
    icon: library,
  },
  {
    id: 4,
    title: "Мои подписки",
    link: "/following",
    icon: subscription,
  },
  {
    id: 5,
    title: "Поиск игроков",
    link: "/users",
    icon: location,
  },
];
