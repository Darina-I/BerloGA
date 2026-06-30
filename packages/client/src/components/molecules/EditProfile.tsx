import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { cityApi } from "../../api/cityAPI";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { check } from "../../assets";
import Button from "../atoms/Button";
import { genreApi } from "../../api/genreAPI";
import { profileAPI } from "../../api/userAPI";
import type { UpdateUser } from "../../types/user.types";
import { setUser } from "../../store/userSlice";

interface EditProfileProps {
  closeEdit: () => void;
}

const EditProfile = ({ closeEdit }: EditProfileProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [cities, setCities] = useState();
  const [newUser, setNewUser] = useState<UpdateUser>({
    nickname: user?.nickname,
    email: user?.email,
    city_id: Number(user?.city?.id),
    social_network: user?.social_network,
    is_show_city: user?.is_show_city,
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await cityApi.getAll();
        setCities(data);
      } catch (error) {
        console.error("Ошибка при загрузке городов: ", error);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser((prev) => ({
      ...prev,
      is_show_city: e.target.checked,
    }));
  };

  const handleChangeSelect = (itemId: number) => {
    setNewUser((prev) => ({
      ...prev,
      city_id: itemId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await profileAPI.updateUser(newUser);

      dispatch(
        setUser({
          user: result.user,
        }),
      );

      closeEdit();
    } catch (error) {
      console.error("Ошибка при обновлении пользователя: ", error);
    }
  };

  return (
    <form className="flex gap-4 w-full" onSubmit={handleSubmit}>
      <Button content="Сохранить" type="submit" className="absolute right-5" />
      <div className="w-1/3 space-y-3">
        <Input
          name="nickname"
          value={newUser?.nickname}
          onChange={handleChange}
          label="Никнейм"
        />
        {cities && (
          <>
            <Select
              onChange={handleChangeSelect}
              valueId={newUser.city_id}
              label="Город проживания"
              list={cities}
              placeholder="Выберите город"
            />

            <div>
              <label className="flex gap-3 items-center">
                <input
                  name="is_show_city"
                  type="checkbox"
                  checked={newUser.is_show_city}
                  onChange={handleChangeCheckbox}
                  className="opacity-0 w-0 h-0 absolute"
                />
                <div className="w-7 h-7 border border-main-color rounded-lg cursor-pointer">
                  {newUser.is_show_city && <img src={check} />}
                </div>
                <p>Другие пользователи видят ваш город</p>
              </label>
            </div>

            <Input
              label="Социальные сети"
              name="social_network"
              onChange={handleChange}
              value={newUser.social_network}
              isTextarea
            />
          </>
        )}
      </div>
      <div className="w-1/3">
        <Input
          name="email"
          value={newUser?.email}
          onChange={handleChange}
          label="Email"
        />
      </div>
    </form>
  );
};

interface EditGenreProps {
  updateGenre: React.Dispatch<React.SetStateAction<number>>;
}

const EditGenre = ({ updateGenre }: EditGenreProps) => {
  const [genres, setGenres] = useState();
  const [selectGenreId, setSelectGenreId] = useState<number>();

  useEffect(() => {
    (async () => {
      try {
        const data = await genreApi.getAll();
        setGenres(data);
      } catch (error) {
        console.error("Ошибка при загрузке городов: ", error);
      }
    })();
  }, []);

  const handleChangeSelect = (itemId: number) => {
    setSelectGenreId(itemId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectGenreId) {
      try {
        const result = await profileAPI.postFavouriteGenres(selectGenreId);
        updateGenre((prev) => prev + 1);
      } catch (error) {
        console.log("Ошибка добавления любимого жанра");
      }
    }
  };

  return (
    <form className="flex gap-4 text-sm w-full" onSubmit={handleSubmit}>
      {genres && (
        <>
          <div className="w-1/3">
            <Select
              list={genres}
              valueId={selectGenreId}
              placeholder="Выберите жанр"
              onChange={handleChangeSelect}
            />
          </div>
          <Button content="Добавить" type="submit" />
        </>
      )}
    </form>
  );
};

export { EditProfile, EditGenre };
