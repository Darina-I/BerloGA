import { library, subscription, location } from "../assets/index";

export const menu = [
  {
    id: 1,
    title: "Моя библиотека",
    link: "/library",
    icon: library,
  },
  {
    id: 2,
    title: "Мои подписки",
    link: "/following",
    icon: subscription,
  },
  {
    id: 3,
    title: "Поиск игроков",
    link: "/users",
    icon: location,
  },
];
