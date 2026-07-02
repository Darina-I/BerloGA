import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Link from "../atoms/Link";
import { authAPI } from "../../api/authAPI";
import { setUser } from "../../store/userSlice";
import { loadFavouritesGameIds } from "../../utils/loadFavouriteGameIds";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    if (!formData.login) {
      setError("Введите никнейм");
      return false;
    }

    if (!formData.password) {
      setError("Введите пароль");
      return false;
    }

    if (!formData.repeatPassword) {
      setError("Повторите пароль");
      return false;
    }

    if (formData.password !== formData.repeatPassword) {
      setError("Пароли не совпадают");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (isValid) {
      try {
        const result = await authAPI.register(
          formData.login,
          formData.password,
        );

        dispatch(
          setUser({
            user: result.user,
          }),
        );

        await loadFavouritesGameIds(dispatch);

        navigate("/");
      } catch (error) {
        setError("Ошибка регистрации");
      }
    }
  };

  return (
    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
      <Input
        placeholder="Логин(никнейм)"
        name="login"
        onChange={handleChange}
      />
      <Input
        placeholder="Пароль"
        name="password"
        type="password"
        onChange={handleChange}
      />
      <Input
        placeholder="Повторите пароль"
        name="repeatPassword"
        type="password"
        onChange={handleChange}
      />
      {error && <p className="text-red-700 self-start font-medium">{error}</p>}
      <div className="space-y-0.5 w-1/2 text-center">
        <Button className="w-full" content="Зарегистрироваться" type="submit" />
        <Link content="Уже есть аккаунт" link="/login" />
      </div>
    </form>
  );
};

export default RegisterForm;
