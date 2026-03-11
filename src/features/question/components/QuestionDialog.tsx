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
import { useTranslation } from "react-i18next";


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

const InformationFormDialog = ({ onSuccess }: InformationFormDialogProps) => {
  const router = useRouter();
  const { t } = useTranslation();

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
        toast.error(result.error || t("formm.error"));
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(t("formm.error"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("formm.enterInformation")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("formm.title")}</DialogTitle>
          <DialogDescription>{t("formm.required")}</DialogDescription>
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
                      <FormLabel>{t("formm.questionTitle")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("formm.questionPlaceholder")} {...field} />
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
                      <FormLabel>{t("formm.questionType")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("formm.typePlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="anxiety_program">
                            {t("formm.anxietyProgram")}
                          </SelectItem>
                          <SelectItem value="depression_program">
                            {t("formm.depressionProgram")}
                          </SelectItem>
                          <SelectItem value="general">
                            {t("formm.general")}
                          </SelectItem>
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
                  <FormLabel>{t("formm.answerLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("formm.answerPlaceholder")}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="justify-self-end self-end">
              {t("formm.submit")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InformationFormDialog;
