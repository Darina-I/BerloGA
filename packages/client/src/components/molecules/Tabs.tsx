interface TabsProps {
  list: { name: string; label: string }[];
  handleClick: (type: string) => void;
  currentTab: string;
}

const Tabs = ({ list, handleClick, currentTab }: TabsProps) => {
  return (
    <div className="flex gap-2 justify-center">
      {list.map((item) => (
        <div
          onClick={() => handleClick(item.name)}
          className={`rounded-lg p-1 ${currentTab === item.name ? "bg-[#d9ad6a]" : "bg-second-color"} hover:bg-[#d9ad6a] cursor-pointer`}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
