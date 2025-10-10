import FormButton from "@/components/button";
import Icon from "@/components/icon";

export default function Home() {
  return (
    <div className="flex gap-4 h-full justify-evenly items-center">
      <Icon width={350} height={350} alt="Twitter Icon"></Icon>

      <div className="flex flex-col items-start gap-10">
        <h1 className="font-extrabold text-7xl tracking-tighter rotate-x-[35deg]">
          Happening now
        </h1>
        <div className="flex flex-col w-[250px] gap-4">
          <h3 className="font-bold text-4xl tracking-tighter rotate-x-[35deg]">
            Join today.
          </h3>
          <FormButton
            icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
            outline={false}
          >
            Sign up with Google
          </FormButton>
          <div className="flex items-center gap-2">
            <div className="h-[1px] bg-card flex-1"></div>
            <p className="w-fit">OR</p>
            <div className="h-[1px] bg-card flex-1"></div>
          </div>
          <FormButton icon={null} outline={false}>
            Create an account
          </FormButton>
          <p className="text-[10px] font-light tracking-wide">
            By signing up, you agree to the{" "}
            <span className="text-primary">Terms of Service</span> and{" "}
            <span className="text-primary">Privacy Policy</span>, including{" "}
            <span className="text-primary">Cookie Use</span>.
          </p>
          <h4 className="font-bold mt-10">Already have an account?</h4>
          <FormButton icon={null} outline={true}>
            Sign in
          </FormButton>
        </div>
      </div>
    </div>
  );
}
