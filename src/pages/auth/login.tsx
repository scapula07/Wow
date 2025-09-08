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
import {
  type LoginSchemaType,
  loginSchema,
} from "@/modules/auth/schema/login.schema";
import ErrorAlert from "@/components/alerts/error-alert";
import { Link,useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import GoogleAuth from "@/modules/auth/components/google-auth";
import { VStack } from "@/components/ui/stack";
import { authApi } from "@/firebase/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Call API to login

  const submit: SubmitHandler<LoginSchemaType> = async (data) => {
    setErrorResponse(null);
    setLoading(true);
    try {
      const res = await authApi.loginWithEmail(data.email, data.password);
      if (!res.success) {
        setErrorResponse(res.error || "Login failed");
      } else {
           localStorage.clear();
          localStorage.setItem('user',JSON.stringify(res));
          navigate("/");
        // Optionally redirect or show success
        // e.g., navigate('/home');
      }
    } catch (err: any) {
      setErrorResponse(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack
      className={`md:w-[579px] w-[92vw] mx-auto h-screen justify-center rounded-[50px] font-[Inter] space-y-3`}
    >
      <VStack className="space-y-2">
        <h1 className="text-center font-semibold text-[28px]">Login</h1>
        <p className="text-[#FAFAFAB2] md:text-xl text-center">
          Log in to account to continue with us.
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

          <Link
            to="/auth/forgot-password"
            className="text-primary text-right text-xs font-semibold leading-0"
          >
            Forgot password?
          </Link>

          <Button type="submit" className="w-full font-bold mt-4.5 h-14" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </Button>

          <div className="flex flex-col space-y-1 mt-2">
            <div className="flex items-center w-[90%] mx-auto space-x-4 whitespace-nowrap">
              <hr className="w-full border-white" />
              <p className="font-semibold">Or continue with</p>
              <hr className="w-full border-white" />
            </div>

            <GoogleAuth text="Login with Google" />

            <p className="text-center mt-6 text-[#FAFAFA66]">
              Don&apos;t have an account?{" "}
              <Link to="/auth/signup" className="font-semibold text-primary ">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </VStack>
  );
};

export default Login;
