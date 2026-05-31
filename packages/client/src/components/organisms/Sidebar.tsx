import { useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import { menu } from "../../constants/sidebar";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-2 bottom-4 left-2 bg-main-color p-1.5 rounded-md">
      <img
        className="cursor-pointer"
        src={logo}
        onClick={() => navigate("/")}
      />
      <div className="flex flex-col gap-4 items-center mt-10">
        {menu.map((item) => (
          <div
            key={item.id}
            className="space-y-4"
            onClick={() => navigate("/library")}
          >
            <img
              className="cursor-pointer"
              src={item.icon}
              width={30}
              title={item.title}
            />
            {item.id < menu.length && (
              <div className="border-b border-second-color" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
