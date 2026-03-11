import { headers } from "next/headers";

export function getLocale() {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1];
  return locale;
}
