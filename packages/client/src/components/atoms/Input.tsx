interface InputProps {
  placeholder: string;
}

const Input = ({ placeholder }: InputProps) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="bg-second-color w-full rounded-lg px-3 py-2"
    />
  );
};

export default Input;
