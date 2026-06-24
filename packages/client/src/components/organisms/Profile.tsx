import { useSelector } from "react-redux";
import { edit, person } from "../../assets";
import Button from "../atoms/Button";
import ListItems from "../molecules/ListItems";
import type { RootState } from "../../store";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user.user);
  return (
    <div className="border-2 border-second-color rounded-lg p-5 space-y-5 relative">
      <div className="absolute right-5">
        <Button content={edit} isIconButton />
      </div>
      <div className="flex gap-10 w-full">
        <div className="rounded-full p-10 bg-second-color">
          <img src={person} width={80} />
        </div>
        <div className="w-1/2">
          <p className="text-2xl font-bold">{user?.nickname}</p>
          <div className="mt-3 text-lg">
            {user?.email && (
              <div className="flex items-center gap-2">
                <p>Email:</p>
                <div className="flex-1 h-[0.5px] bg-second-color" />
                <p>{user?.email}</p>
              </div>
            )}
            {user?.city && (
              <div className="flex items-center gap-2">
                <p>Город:</p>
                <div className="flex-1 h-[0.5px] bg-second-color" />
                <p>{user.city.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="-space-y-1">
        <p>Любимые жанры</p>
        <ListItems
          list={[
            "Логика",
            "Семейные игры",
            "Стратегия",
            "Карточные игры",
            "Экономика",
          ]}
        />
      </div>
    </div>
  );
};

export default Profile;
