"use client";

import { Button } from "@nguyenthanhduyofficial/ui/components/button";
import { useTranslations } from "next-intl";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@nguyenthanhduyofficial/ui/components/field";
import { Controller, useForm } from "react-hook-form";
import {
  SignInType,
  SignUpType,
  SignInSchema,
  SignUpSchema,
} from "@nguyenthanhduyofficial/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nguyenthanhduyofficial/ui/components/input";
import { Checkbox } from "@nguyenthanhduyofficial/ui/components/checkbox";
import { Separator } from "@nguyenthanhduyofficial/ui/components/separator";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import Link from "next/link";

export default function AuthForm() {
  const t = useTranslations("Auth");
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <>
      <div
        className="z-20 mx-4 p-4 border rounded-lg space-y-8 bg-card md:mx-16 overflow-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex gap-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setIsSignUp(false)}
          >
            {t("signIn")}
          </Button>
          <Separator orientation="vertical" />
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setIsSignUp(true)}
          >
            {t("signUp")}
          </Button>
        </div>
        {isSignUp ? <SignUpForm /> : <SignInForm />}
      </div>
    </>
  );
}

function SignInForm() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const toggleAuthModal = useAuthStore((s) => s.toggleAuthModal);
  const [error, setError] = useState("");

  // const form = useForm({
  //   resolver: zodResolver(SignInSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //     rememberMe: "off",
  //   },
  // });
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "test@gmail.com",
      password: "test1234",
      rememberMe: "on",
    },
  });

  async function onSubmit(values: SignInType) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });
    if (error?.code) {
      setError(error?.code);
      return;
    }
    toggleAuthModal();
  }
  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t(field.name)}</FieldLabel>
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
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t(field.name)}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={`*${t(field.name)}`}
                  type="password"
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
            name="rememberMe"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
                className="space-x-2"
              >
                <Checkbox {...field} id={field.name} />
                <p>{t(field.name)}</p>{" "}
                {fieldState.invalid && fieldState.error?.message && (
                  <FieldError
                    errors={[{ message: t(fieldState.error.message) }]}
                  />
                )}
              </Field>
            )}
          />

          {error && <FieldError errors={[{ message: t(error) }]} />}
          <Button size="lg" type="submit">
            {t("signIn")}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
function SignUpForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const toggleAuthModal = useAuthStore((s) => s.toggleAuthModal);
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerm: false,
    },
  });
  const [error, setError] = useState("");
  async function onSubmit(values: SignUpType) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error?.code) {
      setError(error.code);
      return;
    }
    toggleAuthModal();
  }
  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t(field.name)}</FieldLabel>
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
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t(field.name)}</FieldLabel>
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
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t(field.name)}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={`*${t(field.name)}`}
                  type="password"
                />
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
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t(field.name)}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={`*${t(field.name)}`}
                  type="password"
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
            name="acceptTerm"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id={field.name}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                  />
                  <p>{t("acceptTerm")}</p>{" "}
                </div>
                {fieldState.invalid && fieldState.error?.message && (
                  <FieldError
                    errors={[{ message: t(fieldState.error.message) }]}
                  />
                )}
              </Field>
            )}
          />

          {error && <FieldError errors={[{ message: t(error) }]} />}
          <Button size="lg" type="submit">
            {t("signUp")}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
