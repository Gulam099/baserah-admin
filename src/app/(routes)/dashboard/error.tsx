"use client"; // Error components must be Client Components
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center items-center  flex-col min-h-[70vh] h-[90vh] w-full p-8 gap-4">
      <Image src="/image/error.svg" alt="404" width={500} height={500} />
      <h2 className="font-semibold text-lg text-center text-primary-900">
        Something went wrong!{" "}
      </h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
