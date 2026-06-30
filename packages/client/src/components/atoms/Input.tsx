interface InputProps {
  placeholder?: string;
  name: string;
  type?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  value?: string;
  label?: string;
  isTextarea?: boolean;
}

const Input = ({
  placeholder,
  name,
  type = "text",
  onChange,
  value,
  label,
  isTextarea = false,
}: InputProps) => {
  const Tag = isTextarea ? "textarea" : "input";

  return (
    <>
      {label && <p className="mb-1">{label}</p>}
      <Tag
        type={type}
        name={name}
        placeholder={placeholder}
        className="bg-second-color w-full rounded-lg px-3 py-2"
        onChange={onChange}
        value={value}
      />
    </>
  );
};

export default Input;
