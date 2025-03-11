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

// 1) Define your Zod schema for form fields
const formSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  profile_picture: z.string().optional(),
  specialization: z.string().min(3).optional(),
  sub_specialization: z.string().min(3).optional(),
  age_categories: z.array(z.string()).optional(),
  experience: z.string().min(1).optional(),
  consultation_method: z.array(z.string()).optional(),
  response_time: z.string().min(1).optional(),
  education: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  bio: z.string().optional(),
});

type EditSpecialistFormType = z.infer<typeof formSchema>;

// 2) Props: `data` from the specialist, plus `specialistId` for the endpoint
interface EditSpecialistDialogProps {
  data: any; // The existing specialist data
  
}

export default function EditSpecialistDialog(props: EditSpecialistDialogProps) {
  const { data } = props;

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
      name: data.full_name,
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
    },
  });

  // 4) Submit => build FormData => PUT
  async function onSubmit(values: EditSpecialistFormType) {
    try {
      // Prepare multipart/form-data
      const formData = new FormData();

      // Append text fields
      formData.append("name", values.name ?? "");
      formData.append("email", values.email ?? "");
      formData.append("specialization", values.specialization ?? "");
      formData.append("sub_specialization", values.sub_specialization ?? "");
      formData.append("experience", values.experience ?? "");
      formData.append("response_time", values.response_time ?? "");
      formData.append("bio", values.bio ?? "");

      if (values.age_categories) {
        values.age_categories.forEach((ageCat) =>
          formData.append("age_categories[]", ageCat)
        );
      }
      if (values.consultation_method) {
        values.consultation_method.forEach((method) =>
          formData.append("consultation_method[]", method)
        );
      }
      if (values.education) {
        values.education.forEach((edu) =>
          formData.append("education[]", edu)
        );
      }
      if (values.language) {
        values.language.forEach((lang) => formData.append("language[]", lang));
      }

      if (files && files.length > 0) {
        formData.append("profile_picture", files[0]);
      }

      // 5) Send PUT request
      const url = `${ApiBaseUrl}/api/doctor/update-profile/${data._id}`;
      const res = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        // handle error
        const errorData = await res.json();
        console.error("Server error:", errorData);
        toast.error(errorData?.message || "Failed to update specialist.");
        return;
      }

      const responseData = await res.json();
      toast.success("Specialist updated successfully!");
      console.log("Server response", responseData);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Data</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Specialist Information</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[80vh] p-4 border rounded-xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-w-4xl mx-auto py-10"
            >
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jone doe" type="text" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@email.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Years of Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="text" {...field} />
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
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Specialty</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Cardiology"
                            type="text"
                            {...field}
                          />
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
                        <FormLabel>Subspecialty</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Interventional Cardiology"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="response_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response time</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="24 hours"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="age_categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Categories</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Enter your tags"
                      />
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
                    <FormLabel>Consultation methods</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Enter your tags"
                      />
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
                    <FormLabel>Academic qualification</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Enter your tags"
                      />
                    </FormControl>
                    <FormDescription>
                      Add multiple qualification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Enter your tags"
                      />
                    </FormControl>
                    <FormDescription>Select multiple options.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=""
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Uploader for Profile Picture */}
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="profile_picture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={files}
                          onValueChange={setFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput
                            id="fileInput"
                            className="outline-dashed outline-1 outline-slate-500"
                          >
                            <div className="flex items-center justify-center flex-col p-8 w-full">
                              <CloudUpload className="text-gray-500 w-10 h-10" />
                              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>
                                &nbsp; or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF
                              </p>
                            </div>
                          </FileInput>
                          <FileUploaderContent>
                            {files &&
                              files.length > 0 &&
                              files.map((file, i) => (
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

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
