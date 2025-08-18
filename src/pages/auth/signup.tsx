import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import ErrorAlert from "@/components/alerts/error-alert";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import GoogleAuth from "@/modules/auth/components/google-auth";
import { VStack } from "@/components/ui/stack";
import {
  SignupSchema,
  type SignupSchemaType,
} from "@/modules/auth/schema/signup.schema";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  // Call API to signup

  const submit: SubmitHandler<SignupSchemaType> = async (data) => {
    setErrorResponse(null);
    console.log(data);
  };

  return (
    <VStack
      className={`md:w-[579px] w-[92vw] mx-auto rounded-[50px] font-[Inter] space-y-3 py-10`}
    >
      <VStack className="space-y-2">
        <h1 className="text-center font-semibold text-[28px]">Sign up</h1>
        <p className="text-[#FAFAFAB2] md:text-xl text-center">
          Create an account to get started with us.
        </p>
      </VStack>

      {errorResponse && <ErrorAlert message={errorResponse} />}

      <Form {...form}>
        <form
          className="w-full flex flex-col space-y-5 mt-5"
          onSubmit={form.handleSubmit(submit)}
        >
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1 text-base">First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    className="h-14 rounded-[10px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1 text-base">Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    className="h-14 rounded-[10px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1 text-base">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-14 rounded-[10px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="mb-1 text-base">Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create your password "
                    className="h-14 rounded-[10px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />

                {!showPassword ? (
                  <EyeOff
                    size={18}
                    className="text-[#939393] absolute right-4 top-[55px] z-10 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                ) : (
                  <Eye
                    size={18}
                    className="text-[#939393] absolute right-4 top-[55px] z-10 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                )}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full font-bold mt-4.5 h-14">
            Create Account
          </Button>

          <div className="flex flex-col space-y-1 mt-2">
            <div className="flex items-center w-[90%] mx-auto space-x-4 whitespace-nowrap">
              <hr className="w-full border-white" />
              <p className="font-semibold">Or sign up with</p>
              <hr className="w-full border-white" />
            </div>

            <GoogleAuth text="Sign up with Google" />

            <p className="text-center mt-6 text-[#FAFAFA66]">
              Already have an account?{" "}
              <Link to="/auth/login" className="font-semibold text-primary ">
                Login
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </VStack>
  );
};

export default Signup;
