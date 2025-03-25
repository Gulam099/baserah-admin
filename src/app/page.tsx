import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Link href={"/dashboard"}>Dashboard</Link>
      <Link href={"/terms-of-service"}>Terms of service</Link>
      <Link href={"/privacy-policy"}>Privacy policy</Link>
    </div>
  );
}
