import { check } from "../../assets";

interface CheckboxProps {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  value?: string | number;
}

const Checkbox = ({ name, checked, onChange, label, value }: CheckboxProps) => {
  return (
    <label className="flex gap-3 items-center">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="opacity-0 w-0 h-0 absolute"
        value={value}
      />
      <div className="w-7 h-7 border border-main-color rounded-lg cursor-pointer">
        {checked && <img src={check} />}
      </div>
      <p>{label}</p>
    </label>
  );
};

export default Checkbox;
