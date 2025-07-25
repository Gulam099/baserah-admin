"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ApiBaseUrl } from "../../../../const";
import { useState } from "react";

const formSchema = z.object({
  question_title: z
    .string()
    .min(3, "Question must be at least 3 characters long"),
  question_type: z.enum(["anxiety_program", "depression_program", "general"]),
  answer: z.string().min(5, "Answer must be at least 5 characters long"),
});

interface InformationFormDialogProps {
  onSuccess?: () => void;
}
const InformationFormDialog = ({ onSuccess}:InformationFormDialogProps) => {
  const router = useRouter();
 const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question_title: "",
      question_type: "general",
      answer: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`${ApiBaseUrl}/api/admin/add-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Question created successfully!");
        router.refresh();
        setOpen(false);
         if (onSuccess) {
          onSuccess();
        } 
      } else {
        toast.error(result.error || "Failed to create question.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Enter Information</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Enter A Question In The Information Bank</DialogTitle>
          <DialogDescription>* fields are required</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full mx-auto py-4 flex flex-col"
          >
            <div className="flex md:flex-row flex-col flex-wrap gap-4">
              <div className="flex-1 w-full">
                <FormField
                  control={form.control}
                  name="question_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your question here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1 w-full">
                <FormField
                  control={form.control}
                  name="question_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Type of the question" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="anxiety_program">
                            Anxiety Program
                          </SelectItem>
                          <SelectItem value="depression_program">
                            Depression Program
                          </SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the text of the answer to the question"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="justify-self-end self-end">
              Add Content
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InformationFormDialog;
