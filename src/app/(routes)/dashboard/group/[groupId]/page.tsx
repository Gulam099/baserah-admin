import EditSupportGroupClient from "@/features/group/component/groupContentPage";

export default function Page({ params }: { params: { groupId: string } }) {
  return <EditSupportGroupClient id={params.groupId} />;
}