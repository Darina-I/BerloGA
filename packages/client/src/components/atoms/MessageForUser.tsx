interface MessageProps {
  content: string;
  isError?: boolean;
}

const MessageForUser = ({ content, isError = false }: MessageProps) => {
  return (
    <p className={isError ? "text-red-600" : "text-green-600"}>{content}</p>
  );
};

export default MessageForUser;
