import { CallVideoPage } from "@/components/call-video/VideoRoom";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <h1>Call Video Page</h1>
      <p>Room ID: {id}</p>
      <CallVideoPage roomId={id} />
    </>
  );
}
