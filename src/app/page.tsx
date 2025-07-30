import Logo from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-dvh flex-1 gap-4">
        <Logo className="size-48" />

        <div className="flex justify-center items-center w-full  gap-4">
          <Button asChild>
            <Link href="/dashboard">{t("home.dashboard")}</Link>
          </Button>
          <Button asChild>
            <Link href="/terms-of-service">{t("home.terms")}</Link>
          </Button>
          <Button asChild>
            <Link href="/privacy-policy">{t("home.privacy")}</Link>
          </Button>
          {/* <Button asChild>
            <Link
              href={`/payment`}
            >
              {t("home.payment")}
            </Link>
          </Button> */}
        </div>
      </div>
    </>
  );
}
