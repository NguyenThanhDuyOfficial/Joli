"use client";

import { Button } from "@nguyenthanhduyofficial/ui/components/button";
import { Menu, Search, ShoppingCart, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import { authClient } from "../lib/auth-client";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Auth");
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  return (
    <>
      <header className="fixed top-0 right-0 w-full h-15 z-50 px-5 py-2 flex justify-between items-center bg-background">
        <div>
          <Menu />
        </div>
        <div>
          <Link href="/" className="text-xl">
            Joli
          </Link>
        </div>
        <div className="flex gap-4">
          <Search />
          <ShoppingCart />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsOpen((v) => !v)}
          >
            {session ? <User /> : <LogIn />}
          </Button>
        </div>
      </header>

      {isOpen &&
        (session ? (
          <div className="fixed top-15 right-0 z-40 p-2 pt-2 mr-2 rounded-b-lg bg-background">
            <Button onClick={async () => await authClient.signOut()}>
              {t("signOut")}
            </Button>
          </div>
        ) : (
          <div className="fixed top-0 right-0 z-40 w-full h-screen bg-background/90 flex flex-col justify-center">
            <AuthForm />
          </div>
        ))}
    </>
  );
}
