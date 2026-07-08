import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { logo } from "../../assets";
import { menu } from "../../constants/sidebar";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);

  return (
    <div className="fixed top-2 bottom-4 left-2 bg-main-color p-1.5 rounded-md">
      <img
        className="cursor-pointer"
        src={logo}
        onClick={() => navigate("/")}
      />
      <div className="flex flex-col gap-4 items-center mt-10">
        {menu.map((item) => (
          <>
            {(item.role === role || !item.role) && (
              <div
                key={item.id}
                className="space-y-4"
                onClick={() => navigate(item.link)}
              >
                <img
                  className="cursor-pointer"
                  src={item.icon}
                  width={30}
                  title={item.title}
                />
                {item.id < menu.length - 1 && (
                  <div className="border-b border-second-color" />
                )}
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
