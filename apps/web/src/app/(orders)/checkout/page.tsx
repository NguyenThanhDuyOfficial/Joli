import CheckoutClientPage from "@/src/components/CheckoutClientPage";
import { checkoutSessionService } from "@/src/server/container";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { sessionId } = await searchParams;
  if (!sessionId) notFound();

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent sessionId={sessionId} />
    </Suspense>
  );
}

async function CheckoutContent({ sessionId }: { sessionId: string }) {
  const session = await checkoutSessionService.getById(sessionId);
  if (!session) notFound();

  return <CheckoutClientPage session={session} />;
}

function CheckoutSkeleton() {
  return <p>Đang tải thông tin thanh toán...</p>;
}
