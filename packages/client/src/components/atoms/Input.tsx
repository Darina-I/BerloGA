interface InputProps {
  placeholder: string;
  name: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ placeholder, name, type = "text", onChange }: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="bg-second-color w-full rounded-lg px-3 py-2"
      onChange={onChange}
    />
  );
};

export default Input;
