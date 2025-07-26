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
import { toast } from "sonner";
import { ApiBaseUrl } from "../../../../const";
import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const formSchema = z.object({
  group_title: z
    .string()
    .min(3, "Group must be at least 3 characters long"),
  group_type: z
    .string()
    .min(2, "Group type must be at least 2 characters long"),
  image: z.any().refine((file) => file instanceof File, "Please select an image file")
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Only JPEG, PNG, WebP, and GIF files are allowed"
    ),
});

interface InformationFormDialogProps {
  onSuccess?: () => void;
}

const InformationFormDialog = ({ onSuccess }: InformationFormDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_title: "",
      group_type: "",
      image: undefined,
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("image", undefined);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("group_title", values.group_title);
      formData.append("group_type", values.group_type);
      formData.append("image", values.image);

      const response = await fetch(`${ApiBaseUrl}/api/group/add`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Group created successfully!");
        router.refresh();
        setOpen(false);
        setImagePreview(null);
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.error || "Failed to create Group.");
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
          <DialogTitle>Enter Information of  Group</DialogTitle>
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
                  name="group_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your Group here"
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
                  name="group_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter group type"
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      
                      {!imagePreview ? (
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> an image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WebP or GIF (MAX. 5MB)
                            </p>
                          </div>
                        </label>
                      ) : (
                        <div className="relative">
                          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            {form.watch("image")?.name}
                          </div>
                        </div>
                      )}
                    </div>
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