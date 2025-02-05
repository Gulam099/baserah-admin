import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Link href={'/dashboard'}>Dashboard</Link>
    </div>
  );
}
