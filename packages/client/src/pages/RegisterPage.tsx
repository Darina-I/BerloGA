import RegisterForm from "../components/organisms/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className=" p-5 border border-main-color rounded-md w-1/3">
        <p className="text-2xl mb-5 font-bold text-center">Регистрация</p>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
