"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  question: z.string().min(10),
  type: z.string(),
  answer: z.string().min(1),
});

export interface Question {
  id: string
  tag: "Anxiety program" | "General"
  title: string
  content: string
}

export interface PaginatedResponse {
  data: Question[]
  total: number
  page: number
  pageSize: number
}


const mockQuestions: Question[] = Array.from({ length: 50 }, (_, i) => ({
  id: `q${i + 1}`,
  tag: i % 3 === 0 ? "General" : "Anxiety program",
  title: "The wording of the first question?",
  content: "ext of the answer to the question Text of the answer to the question Text of the answer to the",
}))






export default function page() {
  async function fetchQuestions(page: number, pageSize: number): Promise<PaginatedResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    const start = (page - 1) * pageSize
    const end = start + pageSize
  
    return {
      data: mockQuestions.slice(start, end),
      total: mockQuestions.length,
      page,
      pageSize,
    }
  }

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 9

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true)
      try {
        const response = await fetchQuestions(currentPage, pageSize)
        setQuestions(response.data)
        setTotalPages(Math.ceil(response.total / pageSize))
      } catch (error) {
        console.error("Failed to fetch questions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [currentPage])


  return (
    <>
      <div>
        <InformationFormDialog />
      </div>
      <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="animate-pulse">
                <CardHeader className="h-16 bg-gray-200 rounded-t-lg" />
                <CardContent className="h-24 bg-gray-100" />
                <CardFooter className="h-16 bg-gray-200 rounded-b-lg" />
              </Card>
            ))
          : questions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <Badge variant={question.tag === "General" ? "success" : "default"} className="w-fit">
                    {question.tag}
                  </Badge>
                  <h3 className="font-semibold mt-2">{question.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{question.content}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Hide
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    publish
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
    </>
  );
}

const InformationFormDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="">Enter Information</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Enter A Question In The Information Bank</DialogTitle>
          <DialogDescription>* fields must required</DialogDescription>
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
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your question here"
                          type="text"
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
                  name="type"
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
                  <FormLabel>Enter the answer</FormLabel>
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
