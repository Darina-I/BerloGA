import { heartFull, heartLine } from "../../assets";

interface FavouriteProps {
  isFavourite: boolean;
  onClick: () => void;
}

const Favourite = ({ isFavourite, onClick }: FavouriteProps) => {
  return (
    <div className="relative">
      <div className="absolute top-1 right-1" onClick={onClick}>
        <img src={isFavourite ? heartFull : heartLine} width={25} />
      </div>
    </div>
  );
};

export default Favourite;
