interface ListItemsProps {
  list: string[];
}

const ListItems = ({ list }: ListItemsProps) => {
  return (
    <div className="flex gap-2 flex-wrap mt-2 text-sm">
      {list?.map((item) => (
        <div
          className="bg-main-color text-white rounded-full px-5 py-1"
          key={item}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default ListItems;
