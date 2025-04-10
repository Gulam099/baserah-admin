import Logo from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-dvh flex-1 gap-4">
        <Logo className="size-48" />

        <div className="flex justify-center items-center w-full  gap-4">
          <Button asChild>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href={"/terms-of-service"}>Terms of service</Link>
          </Button>
          <Button asChild>
            <Link href={"/privacy-policy"}>Privacy policy</Link>
          </Button>
          <Button asChild>
            <Link
              href={`/payment/?${encodeURIComponent(
                "doctor_id=67ee649e103cb69f36b5be80&patient_id=67ef8b5cbb0b7fdfb6bd9b12"
              )}`}
            >
              Payment
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
