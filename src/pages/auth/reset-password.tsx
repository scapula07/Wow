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
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/stack";
import {
  resetPasswordSchema,
  type ResetPasswordSchemaType,
} from "@/modules/auth/schema/reset-password.schema";
import { Eye, EyeOff } from "lucide-react";
import PasswordUpdateSuccess from "@/modules/auth/components/password-update-success";

const ResetPassword = () => {
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  // Call API to reset password

  const submit: SubmitHandler<ResetPasswordSchemaType> = async (data) => {
    setErrorResponse(null);
    setSuccess(true);
    console.log(data);
  };

  return (
    <VStack
      className={`md:w-[579px] w-[92vw] mx-auto h-screen justify-center rounded-[50px] font-[Inter] space-y-3`}
    >
      {success && <PasswordUpdateSuccess />}

      {!success && (
        <>
          <VStack className="space-y-3">
            <h1 className="text-center font-semibold text-[28px]">
              Reset Password
            </h1>
            <p className="text-[#525252] md:text-xl text-center">
              Your password must be at least 8 characters long.
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
                name="new_password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="mb-1 text-base">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
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

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="mb-1 text-base">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm password "
                        className="h-14 rounded-[10px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />

                    {!confirmPassword ? (
                      <EyeOff
                        size={18}
                        className="text-[#939393] absolute right-4 top-[55px] z-10 cursor-pointer"
                        onClick={() => setConfirmPassword(true)}
                      />
                    ) : (
                      <Eye
                        size={18}
                        className="text-[#939393] absolute right-4 top-[55px] z-10 cursor-pointer"
                        onClick={() => setConfirmPassword(false)}
                      />
                    )}
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full font-bold mt-3 h-14">
                Reset Password
              </Button>
            </form>
          </Form>
        </>
      )}
    </VStack>
  );
};

export default ResetPassword;
