import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import BarChartsGenres from "../components/diagrams/BarChartGenres";
import BarChartTopGames from "../components/diagrams/BarChartTopGames";

const AdminPage = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <div className="mt-10 flex flex-wrap gap-3 mb-10">
        <BarChartsGenres />
        <BarChartTopGames />
      </div>
    </div>
  );
};

export default AdminPage;
