import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  CreateStreamSchema,
  type CreateStreamSchemaType,
} from "../../schema/create-stream.schema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import SelectStreamThumbnail from "../select-stream-thumbnail";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useStream } from "../../hooks/useStream";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateStream = ({ open, onClose }: Props) => {
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const { setStreamDetails } = useStream();

  const form = useForm<CreateStreamSchemaType>({
    resolver: zodResolver(CreateStreamSchema),
    defaultValues: {
      name: "",
      category: "",
      schedule: "",
    },
  });

  const submit: SubmitHandler<CreateStreamSchemaType> = async (data) => {
    setStreamDetails({
      name: data.name,
      category: data.category,
      schedule: data.schedule,
      thumbnail: file,
    });
    onClose();
    navigate(`/streams/${data.name}/create`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle hidden>Create Stream</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="bg-[#302F2F] border-0 min-w-5xl text-white py-6 pl-6 pr-14 rounded-[20px]"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <div className="flex flex-col space-y-6">
              <p className="font-medium">
                Stream Cover{" "}
                <small className="text-[#FFFFFFB2]">(Optional)</small>
              </p>

              <div className="flex items-center space-x-10">
                <div className="w-[500px] h-[400px]">
                  <SelectStreamThumbnail setFile={setFile} />
                </div>

                <div className="flex flex-col w-full space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1 text-base">
                          Stream Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Give your stream a name"
                            className="h-12 rounded-[5px] bg-[#181717] border-0 placeholder:text-[#AAAAAA]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1 text-base">
                          Category
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-xs !h-12 rounded-[5px] bg-[#181717] border-0 !text-[#AAAAAA]">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="text-white bg-[#000] border-[1.5px] border-[#383A3F]">
                              <SelectItem value="games">Games</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1 text-base">
                          Schedule
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-xs !h-12 rounded-[5px] bg-[#181717] border-0 !text-[#AAAAAA]">
                              <SelectValue placeholder="Select a schedule" />
                            </SelectTrigger>
                            <SelectContent className="text-white bg-[#000] border-[1.5px] border-[#383A3F]">
                              <SelectItem value="now">Now</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-3">
                    <Checkbox id="record" />
                    <FormLabel htmlFor="record" className="text-base">
                      Record this stream
                    </FormLabel>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 py-5">
                <Button
                  type="button"
                  variant="link"
                  className="hover:no-underline text-white h-12"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-12">
                  Create Stream
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStream;
