"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { TagsInput } from "@/components/ui/tags-input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiBaseUrl } from "../../../../const";
import { clerkDoctorClient } from "@/lib/clerkClients";
import { updateDoctor } from "../utils/specialist.util";
import { useTranslation } from "next-i18next";

// 1) Define your Zod schema for form fields
const formSchema = z.object({
  fname: z.string().min(3).optional(),
  lname: z.string().min(3).optional(),
  email: z.string().email().optional(),
  profile_picture: z.string().optional(),
  specialization: z.string().min(3).optional(),
  sub_specialization: z.string().min(3).optional(),
  age_categories: z.array(z.string()),
  experience: z.string().min(1).optional(),
  consultation_method: z.array(z.string()),
  response_time: z.string().min(1).optional(),
  education: z.array(z.string()),
  language: z.array(z.string()),
  fees: z.string().optional(),
  bio: z.string().optional(),
});

type EditSpecialistFormType = z.infer<typeof formSchema>;

// 2) Props: `data` from the specialist, plus `specialistId` for the endpoint
interface EditSpecialistDialogProps {
  data: any; // The existing specialist data
}

export default function EditSpecialistDialog(props: EditSpecialistDialogProps) {
  const { data } = props;
  const { t } = useTranslation();

  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 10,
    multiple: false,
  };

  // 3) Initialize form with existing values from `data`
  const form = useForm<EditSpecialistFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: data.full_name.split(" ")[0] || "",
      lname: data.full_name.split(" ")[1] || "",
      email: data.email,
      profile_picture: data.profile_picture,
      specialization: data.specialization,
      sub_specialization: data.sub_specialization,
      experience: data.experience,
      response_time: data.response_time,
      age_categories: data.age_categories,
      consultation_method: data.consultation_method,
      education: data.education,
      language: data.language,
      bio: data.bio,
      fees: data.fees,
    },
  });

  // 4) Submit => build FormData => PUT
  async function onSubmit(values: EditSpecialistFormType) {
    console.log(values);

    const payload = {
      firstName: values.fname,
      lastName: values.lname,
      //  email: values.email,
      unsafeMetadata: {
        specialization: values.specialization,
        sub_specialization: values.sub_specialization,
        experience: values.experience,
        response_time: values.response_time,
        age_categories: values.age_categories,
        consultation_method: values.consultation_method,
        education: values.education,
        language: values.language,
        fees: values.fees,
        bio: values.bio,
      },
    };

    try {
      // // Prepare multipart/form-data
      // const formData = new FormData();

      // // Append text fields
      // formData.append("name", values.name ?? "");
      // formData.append("email", values.email ?? "");
      // formData.append("specialization", values.specialization ?? "");
      // formData.append("sub_specialization", values.sub_specialization ?? "");
      // formData.append("experience", values.experience ?? "");
      // formData.append("response_time", values.response_time ?? "");
      // formData.append("bio", values.bio ?? "");

      // if (values.age_categories) {
      //   formData.append("age_categories", values.age_categories.join(","));
      // }
      // if (values.consultation_method) {
      //   formData.append(
      //     "consultation_method",
      //     values.consultation_method.join(",")
      //   );
      // }
      // if (values.education) {
      //   formData.append("education", values.education.join(","));
      // }
      // if (values.language) {
      //   formData.append("language", values.language.join(","));
      // }

      // if (files && files.length > 0) {
      //   formData.append("profile_picture", files[0]);
      // }

      // // 5) Send PUT request
      // const url = `${ApiBaseUrl}/api/doctor/update-profile/${data._id}`;
      // const res = await fetch(url, {
      //   method: "PUT",
      //   body: formData,
      // });
      const response = await updateDoctor(data.clerkId, payload);
      toast.success(t("toast.success"));
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(t("toast.error"));
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("form.editButton")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("form.editTitle")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh] p-4 border rounded-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-4xl mx-auto py-10">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="fname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.firstName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="lname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.lastName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.email")}</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.experience")}</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.mainSpecialty")}</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="sub_specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.subSpecialty")}</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="response_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.responseTime")}</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age_categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.ageCategories")}</FormLabel>
                    <FormControl>
                      <TagsInput value={field.value} onValueChange={field.onChange} placeholder="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consultation_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.consultationMethod")}</FormLabel>
                    <FormControl>
                      <TagsInput value={field.value} onValueChange={field.onChange} placeholder="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.education")}</FormLabel>
                    <FormControl>
                      <TagsInput value={field.value} onValueChange={field.onChange} placeholder="" />
                    </FormControl>
                    <FormDescription>{t("form.educationHint")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.languages")}</FormLabel>
                    <FormControl>
                      <TagsInput value={field.value} onValueChange={field.onChange} placeholder="" />
                    </FormControl>
                    <FormDescription>{t("form.languagesHint")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.fees")}</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.bio")}</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="profile_picture"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t("form.profileImage")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={files}
                          onValueChange={setFiles}
                          dropzoneOptions={{ maxFiles: 1, maxSize: 10 * 1024 * 1024, multiple: false }}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
                            <div className="flex items-center justify-center flex-col p-8 w-full">
                              <CloudUpload className="text-gray-500 w-10 h-10" />
                              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">{t("form.uploadInstructions")}</span>
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t("form.uploadNote")}
                              </p>
                            </div>
                          </FileInput>
                          <FileUploaderContent>
                            {files && files.map((file, i) => (
                              <FileUploaderItem key={i} index={i}>
                                <Paperclip className="h-4 w-4 stroke-current" />
                                <span>{file.name}</span>
                              </FileUploaderItem>
                            ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">{t("form.submit")}</Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
