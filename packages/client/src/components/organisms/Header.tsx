import { authAPI } from "../../api/authAPI";
import { exit } from "../../assets";
import Button from "../atoms/Button";
import { logout } from "../../store/userSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const handleClick = async () => {
    try {
      const result = await authAPI.logout();
      dispatch(logout());
    } catch (error) {
      console.log("Ошибка выхода");
    }
  };

  return (
    <div className="flex justify-between">
      <p className="flex items-center gap-1">
        <span className="text-3xl font-bold">BerloGA</span> - форум для
        любителей настольных игр
      </p>
      <Button content={exit} onClick={handleClick} isIconButton withoutBG />
    </div>
  );
};

export default Header;
