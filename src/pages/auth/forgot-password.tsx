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
import ErrorAlert from "@/components/alerts/error-alert";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/stack";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchemaType,
} from "@/modules/auth/schema/forgot-password.schema";
import { saveToSessionStorage } from "@/lib/utils";
import { WOW_VERIFY_EMAIL } from "@/modules/auth/constant";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [errorResponse, setErrorResponse] = useState<string | null>(null);

  const navigate = useNavigate();

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Call API to send verification email

  const submit: SubmitHandler<ForgotPasswordSchemaType> = async (data) => {
    setErrorResponse(null);
    saveToSessionStorage(WOW_VERIFY_EMAIL, data.email);
    navigate("/auth/verify-otp");
  };

  return (
    <VStack
      className={`md:w-[579px] w-[92vw] mx-auto h-screen justify-center rounded-[50px] font-[Inter] space-y-3`}
    >
      <VStack className="space-y-3">
        <h1 className="text-center font-semibold text-[28px]">
          Forgot Password
        </h1>
        <p className="text-[#525252] md:text-xl text-center">
          Enter the email address you used to create the account to receive
          instructions on how to reset your password
        </p>
      </VStack>

      {errorResponse && <ErrorAlert message={errorResponse} />}

      <Form {...form}>
        <form
          className="w-full flex flex-col space-y-3 mt-5"
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

          <Button type="submit" className="w-full font-bold mt-4.5 h-14">
            Send
          </Button>

          <p className="text-center mt-4 text-[#FAFAFA66]">
            Remember your password?{" "}
            <Link to="/auth/login" className="font-semibold text-primary ">
              Login
            </Link>
          </p>
        </form>
      </Form>
    </VStack>
  );
};

export default ForgotPassword;
