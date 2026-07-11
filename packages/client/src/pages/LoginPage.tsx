import LoginForm from "../components/organisms/LoginForm";

const LoginPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className=" p-5 rounded-md w-1/3 bg-white shadow-main-color shadow-md">
        <p className="text-2xl mb-5 font-bold text-center">Вход в систему</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
