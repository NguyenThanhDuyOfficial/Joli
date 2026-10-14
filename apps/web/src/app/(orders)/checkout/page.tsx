import CheckoutClientPage from "@/src/components/CheckoutClientPage";
import { checkoutSessionService } from "@/src/server/container";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { sessionId } = await searchParams;

  if (!sessionId) {
    return;
  }
  const session = await checkoutSessionService.getById(sessionId);

  if (!session) return <div>loading...</div>;

  return <CheckoutClientPage session={session} />;
}
