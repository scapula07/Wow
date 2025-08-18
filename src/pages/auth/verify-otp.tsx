import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorAlert from "@/components/alerts/error-alert";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/stack";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  verifyOTPSchema,
  type VerifyOTPSchemaType,
} from "@/modules/auth/schema/verify-otp.schema";
import { useNavigate } from "react-router-dom";
import { WOW_VERIFY_EMAIL } from "@/modules/auth/constant";
import { getFromSessionStorage } from "@/lib/utils";

const VerifyOTP = () => {
  const [errorResponse, setErrorResponse] = useState<string | null>(null);

  const email = getFromSessionStorage(WOW_VERIFY_EMAIL);

  const navigate = useNavigate();

  const form = useForm<VerifyOTPSchemaType>({
    resolver: zodResolver(verifyOTPSchema),
  });

  // Call API to verify email

  const submit: SubmitHandler<VerifyOTPSchemaType> = async (data) => {
    setErrorResponse(null);
    navigate("/auth/reset-password");
    console.log(data);
  };

  return (
    <VStack
      className={`md:w-[579px] w-[92vw] mx-auto h-screen justify-center rounded-[50px] font-[Inter] space-y-3`}
    >
      <VStack className="space-y-3">
        <h1 className="text-center font-semibold text-[28px]">
          Verification Code Sent
        </h1>
        <p className="text-[#525252] md:text-xl text-center">
          Confirm the email sent to {email} and enter the verification code that
          code that was sent. Code expires in{" "}
          <span className="text-primary">00:59</span>
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    {...field}
                  >
                    <InputOTPGroup className="w-full items-center justify-center space-x-4">
                      {Array.from({ length: 6 }, (_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="border border-[#CBD5E1] rounded-[8px] h-[60px] w-[60px] text-xl"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full font-bold mt-4.5 h-14">
            Verify
          </Button>

          <p className="text-center text-[13px] mt-4 text-[#FAFAFA80]">
            Didn&apos;t receive any code?{" "}
            <Button
              type="button"
              className="font-semibold text-base hover:no-underline px-1"
              variant="link"
            >
              Resend OTP
            </Button>
          </p>

          <div className="flex items-center w-full space-x-4 whitespace-nowrap">
            <hr className="w-full border-[#CBD5E1]" />
            <p className="text-[13px] text-[#FAFAFAB2]">Or</p>
            <hr className="w-full border-[#CBD5E1]" />
          </div>

          <Link
            to="/auth/forgot-password"
            className="text-primary font-medium text-center mt-2"
          >
            Change email
          </Link>
        </form>
      </Form>
    </VStack>
  );
};

export default VerifyOTP;
