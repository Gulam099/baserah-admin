import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center  flex-col min-h-[90vh] h-[90vh] w-full p-8 gap-4">
      <Image src="/image/notFound.svg" alt="404" width={500} height={500} />
      <h2 className="font-semibold text-lg text-center text-primary-900">
        The page you requested could not be found{" "}
      </h2>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
