"use client";

import {
  CheckoutSessionResponse,
  Shipping,
} from "@nguyenthanhduyofficial/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShippingSchema } from "@nguyenthanhduyofficial/schemas";
import { Button } from "@nguyenthanhduyofficial/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@nguyenthanhduyofficial/ui/components/field";
import { Input } from "@nguyenthanhduyofficial/ui/components/input";
import { Separator } from "@nguyenthanhduyofficial/ui/components/separator";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { formatPrice } from "../lib/format";
import { useTransition } from "react";
import { createOrderAction } from "../actions/order.action";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutClientPage({
  session,
}: {
  session: CheckoutSessionResponse;
}) {
  const t = useTranslations("Checkout");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // const form = useForm({
  //   resolver: zodResolver(ShippingSchema),
  //   defaultValues: {
  //     shippingName: "",
  //     shippingAddress: "",
  //     shippingPhone: "",
  //     note: "",
  //   },
  // });

  const form = useForm({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      shippingName: "Nguyễn Thành Duy",
      shippingAddress: "Số xyz, đường ABC, Quận x, TP iop",
      shippingPhone: "0808080080",
      note: "",
    },
  });

  function onSubmit(values: Shipping) {
    startTransition(async () => {
      const result = await createOrderAction({
        ...values,
        checkoutSessionId: session.id,
      });
      if (!result) {
        return;
      }
      if ("error" in result) {
        return;
      }

      router.push(`/orders/${result.data.id}/success`);
    });
  }
  return (
    <>
      <main className="px-4 md:px-16 space-y-4">
        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] md:gap-x-8">
          <div className="w-full py-4 space-y-2">
            <h4>{t("shippingInformation")}</h4>
            <form
              id="checkout-form"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="shippingName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t(field.name)}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder={`*${t(field.name)}`}
                      />{" "}
                      {fieldState.invalid && fieldState.error?.message && (
                        <FieldError
                          errors={[{ message: t(fieldState.error.message) }]}
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="shippingPhone"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t(field.name)}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder={`*${t(field.name)}`}
                      />{" "}
                      {fieldState.invalid && fieldState.error?.message && (
                        <FieldError
                          errors={[{ message: t(fieldState.error.message) }]}
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="shippingAddress"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t(field.name)}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder={`*${t(field.name)}`}
                      />{" "}
                      {fieldState.invalid && fieldState.error?.message && (
                        <FieldError
                          errors={[{ message: t(fieldState.error.message) }]}
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="note"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t(field.name)}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder={`${t(field.name)}`}
                      />{" "}
                      {fieldState.invalid && fieldState.error?.message && (
                        <FieldError
                          errors={[{ message: t(fieldState.error.message) }]}
                        />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>
          <div className="w-fit min-w-80">
            <div className="py-4 space-y-2 space-x-8">
              <div className="">
                <div className="w-full flex justify-between">
                  <p>{t("subTotal")}</p>
                  <p>{formatPrice(session.subTotal)}</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>{t("wrapGift")}</p>
                  <p>{t("free")}</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>{t("shipping")}</p>
                  <p>{t("free")}</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <h5>{t("total")}</h5>
                  <p className="text-xs">{t("includeVAT")}</p>
                </div>
                <h5>{formatPrice(session.total)}</h5>
              </div>
            </div>
            <div className="py-4 space-y-2">
              <div className="flex gap-2 items-end ">
                <h4>{t("shoppingBag")}</h4>
                <p>
                  [{session.items.length} {t("product")}]
                </p>
              </div>
              <div className="px-2">
                {session.items.map((item) => (
                  <div key={item.id} className="flex h-16 gap-2 items-center">
                    <div className="relative h-full aspect-square">
                      <Image
                        src={item.image}
                        alt="Product Image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="w-full">
                      <h5>{item.name}</h5>
                      <div className="w-full flex justify-between">
                        <p>
                          {t("quantity")}: {item.quantity}
                        </p>
                        <p>{formatPrice(item.subTotal)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 left-0 py-2 bg-background md:col-star-">
            <Button form="checkout-form" className="w-full" type="submit">
              {t("payment")}
            </Button>
          </div>
        </div>
        <Separator />
        <div className="py-4 flex flex-col items-center">
          <h5>{t("needHelp")}?</h5>
          <p>{t("call")} 0808 080 0808 | FAQ's</p>
          <Link
            href="mailto:nguyenthanhduyofficial@gmail.com"
            className="underline text-blue-400"
          >
            nguyenthanhduyofficial@gmail.com
          </Link>
        </div>
      </main>
    </>
  );
}
