import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminAPI";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Bar,
} from "recharts";

interface TopGamesProps {
  id: number;
  name: string;
  rating: string;
  library_count: string;
}

interface TopProps {
  topByLibrary: TopGamesProps[];
  topByRating: TopGamesProps[];
}

const BarChartTopGames = () => {
  const [allStat, setAllStat] = useState<TopProps>();
  const [data, setData] = useState<TopGamesProps[]>([]);
  const [currentStat, setCurrentStat] = useState("topByLibrary");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminApi.getTopGames();
        setAllStat(data);
        setData(data["topByLibrary"]);
      } catch (error) {
        console.error("Ошибка при загрузке топа: ", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (stat: "topByLibrary" | "topByRating") => {
    if (allStat) setData(allStat[stat]);
    setCurrentStat(stat);
  };

  return (
    <div className="flex-1 w-fit text-sm border rounded-lg p-3 border-main-color">
      <div className="flex gap-2 justify-center">
        <div
          onClick={() => handleClick("topByLibrary")}
          className="rounded-lg p-1 bg-second-color hover:bg-[#d9ad6a] cursor-pointer"
        >
          Топ 10 по кол-ву добавлений в библиотеку
        </div>
        <div
          onClick={() => handleClick("topByRating")}
          className="rounded-lg p-1 bg-second-color hover:bg-[#d9ad6a] cursor-pointer"
        >
          Топ 10 по рейтингу
        </div>
      </div>
      <ResponsiveContainer height={450}>
        <BarChart data={data} barSize={30} margin={{ bottom: 50, top: 10 }}>
          <CartesianGrid />
          <XAxis
            dataKey="name"
            type="category"
            angle={-30}
            textAnchor="end"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            type="number"
            domain={[0, "dataMax"]}
            tickCount={
              data.length > 0
                ? Math.max(
                    ...data.map((d) => {
                      if (currentStat === "topByLibrary") {
                        return Number(d["library_count"]);
                      } else {
                        return Number(d["rating"]);
                      }
                    }),
                  ) + 1
                : 0
            }
          />
          {currentStat === "topByLibrary" ? (
            <Bar dataKey="library_count" fill="#761f21" radius={[6, 6, 0, 0]} />
          ) : (
            <Bar dataKey="rating" fill="#761f21" radius={[6, 6, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartTopGames;
