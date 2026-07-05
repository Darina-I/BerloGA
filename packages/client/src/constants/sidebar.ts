import { library, subscription, location, diagram } from "../assets/index";

export const menu = [
  {
    id: 1,
    title: "Админ-панель",
    link: "/admin",
    icon: diagram,
    role: "admin",
  },
  {
    id: 2,
    title: "Моя библиотека",
    link: "/library",
    icon: library,
  },
  {
    id: 3,
    title: "Мои подписки",
    link: "/following",
    icon: subscription,
  },
  {
    id: 4,
    title: "Поиск игроков",
    link: "/users",
    icon: location,
  },
];
