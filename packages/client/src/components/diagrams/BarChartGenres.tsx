import { useEffect, useState } from "react";
import {
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { adminApi } from "../../api/adminAPI";

interface CountGamesResponse {
  id: number;
  name: string;
  game_count: number;
}

const BarChartsGenres = () => {
  const [data, setData] = useState<CountGamesResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await adminApi.getCountGames()) as CountGamesResponse[];
        setData(data);
      } catch (error) {
        console.error("Ошибка при загрузке статистики по жанрам: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=" w-fit text-sm border rounded-lg p-3 border-main-color">
      <p className="font-bold text-base mb-2">Количество игр каждого жанра</p>
      <ResponsiveContainer height={450} width={470}>
        <BarChart layout="vertical" data={data} barSize={20}>
          <CartesianGrid />
          <YAxis dataKey="name" type="category" width={110} />
          <XAxis
            type="number"
            domain={[0, "dataMax"]}
            tickCount={
              data.length > 0
                ? Math.max(...data.map((d) => d.game_count)) + 1
                : 0
            }
          />
          <Tooltip
            formatter={(value, name) => [`Количество игр: ${value}`, null]}
            labelFormatter={(label) => [label]}
          />
          <Bar dataKey="game_count" fill="#761f21" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartsGenres;
