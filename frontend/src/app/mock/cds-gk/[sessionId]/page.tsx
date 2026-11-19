import MockPlayer from "@/components/mock/MockPlayer";

export default async function CdsGkMockSession({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <MockPlayer sessionId={sessionId} />;
}
