import { cross } from "../../assets";

interface ListItemsProps {
  list: {
    id: number;
    name: string;
  }[];
  onDelete?: (itemId: number) => void;
  isCanEdit?: boolean;
}

const ListItems = ({ list, onDelete, isCanEdit = false }: ListItemsProps) => {
  const handleDelete = (itemId: number) => {
    if (onDelete) {
      onDelete(itemId);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap text-sm">
      {list?.map((item) => (
        <div
          className={`bg-main-color text-white rounded-full  py-1.5 ${isCanEdit ? "flex gap-3 items-center pl-5 pr-3" : "px-5"}`}
          key={item.id}
        >
          <p>{item.name}</p>
          {isCanEdit && (
            <>
              <div className="border-r h-4" />
              <img
                src={cross}
                width={20}
                className="cursor-pointer"
                onClick={() => handleDelete(item.id)}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListItems;
