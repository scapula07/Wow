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
import { streamApi } from "@/firebase/stream";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import { LIVESTREAM_CATEGORIES } from "@/lib/constants/livestream-categories";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateStream = ({ open, onClose }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
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
     
    if (!user?.id) {
      toast.error("You must be logged in to create a stream");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create stream with Livepeer and Firebase
      const result = await streamApi.create({
        creatorId: user.id,
        streamName: data.name,
        streamThumbnail: file || undefined,
        category: data.category,
      });

      if (result.success && result.data) {
        // Set stream details for the next page
        setStreamDetails({
          name: data.name,
          category: data.category,
          schedule: data.schedule,
          thumbnail: file,
          streamId: result.streamId,
          streamKey: result.data.streamKey,
          playbackId: result.data.playbackId,
          creatorId: result.data.creatorId,
        });

        toast.success("Stream created successfully!");
        onClose();
        navigate(`/streams/${result.streamId}/create`);
      } else {
        toast.error(result.error || "Failed to create stream");
      }
    } catch (error) {
      console.error("Stream creation error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle hidden>Create Stream</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="bg-[#302F2F] border-0 w-[95vw] sm:w-auto sm:min-w-5xl text-white py-4 px-4 sm:py-6 sm:pl-6 sm:pr-14 rounded-[20px] max-h-[90vh] overflow-y-auto"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <div className="flex flex-col space-y-4 sm:space-y-6">
              <p className="font-medium text-sm sm:text-base">
                Stream Cover{" "}
                <small className="text-[#FFFFFFB2]">(Optional)</small>
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-5 sm:space-y-0 sm:space-x-10">
                <div className="w-full sm:w-[500px] h-[250px] sm:h-[400px]">
                  <SelectStreamThumbnail setFile={setFile} />
                </div>

                <div className="flex flex-col w-full space-y-4 sm:space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1 text-sm sm:text-base">
                          Stream Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Give your stream a name"
                            className="h-10 sm:h-12 rounded-[5px] bg-[#181717] border-0 placeholder:text-[#AAAAAA] text-sm sm:text-base"
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
                        <FormLabel className="mb-1 text-sm sm:text-base">
                          Category
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full sm:w-xs !h-10 sm:!h-12 rounded-[5px] bg-[#181717] border-0 !text-[#AAAAAA] text-sm sm:text-base">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="text-white bg-[#000] border-[1.5px] border-[#383A3F] max-h-[300px]">
                              {LIVESTREAM_CATEGORIES.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
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
                        <FormLabel className="mb-1 text-sm sm:text-base">
                          Schedule
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full sm:w-xs !h-10 sm:!h-12 rounded-[5px] bg-[#181717] border-0 !text-[#AAAAAA] text-sm sm:text-base">
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
                    <Checkbox id="record" checked={true} disabled />
                    <FormLabel htmlFor="record" className="text-sm sm:text-base">
                      Record this stream
                    </FormLabel>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 py-3 sm:py-5">
                <Button
                  type="button"
                  variant="link"
                  className="hover:no-underline text-white h-10 sm:h-12 text-sm sm:text-base"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-10 sm:h-12 text-sm sm:text-base w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Stream..." : "Create Stream"}
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
