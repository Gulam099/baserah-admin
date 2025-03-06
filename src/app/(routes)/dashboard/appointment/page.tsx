import AppointmentPage from "@/features/appointment/components/appointment";

export default ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => <AppointmentPage searchParams={searchParams} />;
