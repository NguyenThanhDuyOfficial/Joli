"use client";

import { Button } from "@nguyenthanhduyofficial/ui/components/button";
import { Separator } from "@nguyenthanhduyofficial/ui/components/separator";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
type CheckoutSession = {
  items: {
    id: string;
    variantId: string;
    name: string;
    quantity: number;
    subTotal: number;
    unitPrice: number;
    image: {
      url: string;
      alt: string | null;
    };
  }[];
  id: string;
  total: number | null;
  subTotal: number;
};
export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [session, setSession] = useState<CheckoutSession>();

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch(`/api/v1/checkout/${sessionId}`);
      const data = await res.json();
      setSession(data);
    }
    fetchSession();
  }, [sessionId]);

  if (!session) return <div>loading...</div>;

  return (
    <>
      <main className="px-2">
        <div className="py-4 space-y-2">
          <div className="flex">
            <h3>{t("shoppingBag")}</h3>
            <p>
              [{session.items.length} {t("product")}]
            </p>
          </div>
          <p>{t("wrapGift")}</p>
          <div className="py-2">
            {session.items.map((item) => (
              <div key={item.id} className="flex h-13 gap-2">
                <div className="relative h-full aspect-square">
                  <Image
                    src={item.image.url}
                    alt={item.image.alt ?? "Product Image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full">
                  <p className="text-lg font-medium">{item.name}</p>
                  <div className="w-full flex justify-between">
                    <p>
                      {t("quantity")}: {item.quantity}
                    </p>
                    <p>{item.subTotal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-between">
            <p>{t("subTotal")}</p>
            <p>{session.subTotal}</p>
          </div>
          <div>
            <div>
              <p>{t("total")}</p>
              <p>{t("includeVAT")}</p>
            </div>
            <p>{session.total}</p>
          </div>
        </div>
        <Separator />
        <div className="w-full py-4 flex flex-col items-center">
          <p>{t("needHelp")}?</p>
          <p>{t("call")} 0808 080 0808 | FAQ's</p>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full px-4 py-4 bg-background drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
        <Button className="w-full">{t("payment")}</Button>
      </div>
    </>
  );
}
