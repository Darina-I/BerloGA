import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { edit, person } from "../../assets";
import Button from "../atoms/Button";
import ListItems from "../molecules/ListItems";
import type { RootState } from "../../store";
import { profileAPI } from "../../api/userAPI";
import { EditGenre, EditProfile } from "../molecules/EditProfile";
import type { ProfileUser } from "../../types/user.types";
import type { Genre } from "../../types/models.types";

interface ProfileProps {
  userInfo?: ProfileUser;
}

const Profile = ({ userInfo }: ProfileProps) => {
  const userState = useSelector((state: RootState) => state.user);
  const [user, setUser] = useState<ProfileUser>();
  const isMe = !userInfo;
  const [favouriteGenres, setFavouriteGenres] = useState<Genre[]>();
  const [isEdit, setIsEdit] = useState(false);
  const [updateGenres, setUpdateGenres] = useState(0);

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    } else {
      setUser(userState?.user as ProfileUser);
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await profileAPI.getFavouriteGenres();
        setFavouriteGenres(data);
      } catch (error) {
        console.error(
          "Ошибка при загрузке любимых жанров пользователя: ",
          error,
        );
      }
    };

    if (userInfo) {
      setFavouriteGenres(userInfo.genres);
    } else {
      fetchGenres();
    }
  }, [updateGenres]);

  const handleDeleteGenre = async (genreId: number) => {
    try {
      const result = await profileAPI.deleteFavouriteGenres(genreId);
      setUpdateGenres((prev) => prev + 1);
    } catch (error) {
      console.log("Ошибка удаления любимого жанра");
    }
  };

  const handleCloseEdit = () => {
    setIsEdit(false);
  };

  return (
    <div className=" bg-white shadow-main-color shadow-md rounded-lg p-5 space-y-5 relative">
      {isMe && (
        <div className="absolute right-5">
          {!isEdit && (
            <Button
              content={edit}
              isIconButton
              onClick={() => setIsEdit(true)}
            />
          )}
        </div>
      )}
      <div className="flex gap-10">
        {!isEdit ? (
          <>
            <div className="rounded-full p-10 bg-second-color h-fit">
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
              <div className="space-y-1 mt-2">
                <p>Социальные сети:</p>
                <p className="bg-second-color h-36 rounded-lg p-3">
                  {user?.social_network}
                </p>
              </div>
            </div>
          </>
        ) : (
          <EditProfile closeEdit={handleCloseEdit} />
        )}
      </div>
      {favouriteGenres && (
        <div className={`space-y-1 w-1/2 ${!isEdit && "ml-[14%]"}`}>
          <p>Любимые жанры</p>
          {isEdit && (
            <>
              <EditGenre updateGenre={setUpdateGenres} />
              <div className="border-b border-second-color my-2"></div>
            </>
          )}
          <ListItems
            list={favouriteGenres}
            isCanEdit={isEdit}
            onDelete={handleDeleteGenre}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
