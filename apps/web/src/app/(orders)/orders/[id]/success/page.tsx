import BestSellerSection from "@/src/components/MostLovedSection";
import { formatPrice } from "@/src/lib/format";
import { orderService } from "@/src/server/container";
import { Button } from "@nguyenthanhduyofficial/ui/components/button";
import { Separator } from "@nguyenthanhduyofficial/ui/components/separator";
import { CircleCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { title } from "process";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("Order");
  const { id } = await params;
  const result = await orderService.getById(id);
  const order = result.data;

  const orderInformations = [
    {
      title: t("orderSuccess"),
      value: `#${order.code}`,
    },
    { title: t("ordered"), value: `${order.items.length} ${t("product")}` },
    {
      title: t("deliveryTime"),
      value: `3-5 ${t("day")}`,
    },
    { title: t("address"), value: order.shippingAddress },
    {
      title: t("paymentMethod"),
      value: t(order.paymentMethod),
    },
    { title: t("phoneNumber"), value: order.shippingPhone },
  ];
  return (
    <main className="py-8">
      <div className="w-full flex flex-col gap-2 items-center">
        <div className="px-2 py-4">
          <CircleCheck size={72} />
        </div>
        <div className="py-2 pb-2 text-center space-y-2">
          <h3>{t("orderSuccess")}</h3>
          <p>{t("description")}</p>
        </div>
        <div className="w-full px-4 py-4 bg-card">
          <h4>{t("orderSummary")}</h4>
          <div className="py-4 space-y-2">
            {orderInformations.map((infor, index) => (
              <div className="flex gap-4 justify-between text-sm" key={index}>
                <p>{infor.title}</p>
                <p className="text-end overflow-auto">{infor.value}</p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="pt-2 flex justify-between">
            <h6>{t("total")}</h6>
            <h6>{formatPrice(order.total)}</h6>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 z-50 p-2 py-4 flex flex-col gap-2 w-full bg-background drop-shadow-[0_-4px_4px_rgba(0,0,0,0.2)]">
        <Button>{t("backToHome")}</Button>
        <Button variant="outline">{t("orderTracking")}</Button>
      </div>
      <div>
        <BestSellerSection />
      </div>
    </main>
  );
}
