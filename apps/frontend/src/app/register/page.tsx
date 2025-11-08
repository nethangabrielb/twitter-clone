import RegisterForm from "@/app/register/components/form";

import Icon from "@/components/icon";

const Register = () => {
  return (
    <div className="flex gap-4 h-full justify-evenly items-center">
      <div className="flex-1 flex justify-center">
        <Icon width={450} height={450} alt="Twitter Icon"></Icon>
      </div>

      <div className="flex flex-col items-start gap-10 flex-1">
        <RegisterForm></RegisterForm>
      </div>
    </div>
  );
};

export default Register;
