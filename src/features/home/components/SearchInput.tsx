"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchNormal1 } from "iconsax-react";
import { X } from "lucide-react";
import { ApiBaseUrlLocal } from "../../../../const";

const formSchema = z.object({
  search: z.string(),
});

export default function SearchBar() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  let context: "appointments" | "patients" | "doctors" = "appointments";

  if (pathname.includes("patients")) context = "patients";
  else if (pathname.includes("doctors")) context = "doctors";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { search: "" },
  });

  const searchValue = form.watch("search");

  const fetchAllData = async () => {
    try {
      setLoading(true);
      let response, data;

      if (context === "patients") {
        response = await fetch(`/api/admin/patients`);
        data = await response.json();
        setResults(data.data || []);
      } else if (context === "appointments") {
        response = await fetch(`/api/admin/appointments`);
        data = await response.json();
        setResults(data.data || []);
      } else if (context === "doctors") {
        response = await fetch(`${ApiBaseUrlLocal}/api/doctor/get-doctors`);
        data = await response.json();
        setResults(data || []);
      }
    } catch (err) {
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [context]);

  useEffect(() => {
    if (!searchValue.trim()) {
      const timeout = setTimeout(() => {
        fetchAllData();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [searchValue]);

  const handleClear = () => {
    form.setValue("search", "");
    fetchAllData();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const query = values.search.trim().toLowerCase();
    if (!query) return;

    try {
      setLoading(true);
      let response;

      if (context === "patients") {
        response = await fetch(`/api/admin/patients`);
        const data = await response.json();
        const filtered = data.data.filter((p: any) =>
          p.name.toLowerCase().includes(query)
        );
        setResults(filtered);
      } else if (context === "appointments") {
        response = await fetch(`/api/admin/appointments`);
        const data = await response.json();
        const filtered = data.data.filter((a: any) =>
          a.userId?.name?.toLowerCase().includes(query)
        );
        setResults(filtered);
      } else if (context === "doctors") {
        response = await fetch(`${ApiBaseUrlLocal}/api/doctor/get-doctors`);
        const data = await response.json();
        const filtered = data.filter((d: any) =>
          d.name.toLowerCase().includes(query)
        );
        setResults(filtered);
      }

      form.setValue("search", "");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 pt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-w-5xl w-full mx-auto bg-background rounded-xl"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormControl>
                  <Input
                    placeholder={`Search in ${context}`}
                    {...field}
                    className="pr-10"
                  />
                </FormControl>

                {searchValue && (
                  <X
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-800"
                    size={18}
                    onClick={handleClear}
                  />
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="secondary"
            className="ml-2"
            disabled={loading || !searchValue.trim()}
          >
            <SearchNormal1 size="24" />
          </Button>
        </form>
      </Form>

      <div className="max-w-5xl mx-auto">
        {loading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}

        {!loading && searchValue.trim() && results.length > 0 && (
          <ul className="mt-4 space-y-2">
            {results.map((item, index) => (
              <li
                key={index}
                className="p-3 border rounded-md bg-gray-100 text-gray-800"
              >
                {context === "appointments" && item.userId?.name}
                {context === "patients" && item.name}
                {context === "doctors" &&
                  `${item.name} - ${item.specialization}`}
              </li>
            ))}
          </ul>
        )}

        {!loading && searchValue.trim() && results.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
