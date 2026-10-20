"use client";

import { Button } from "@nguyenthanhduyofficial/ui/components/button";
import { Menu, Search, ShoppingCart, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import { authClient } from "../lib/auth-client";
import { useTranslations } from "next-intl";
import { useAuthStore } from "../stores/auth-store";
import { useShallow } from "zustand/shallow";

export default function Header() {
  const t = useTranslations("Auth");
  const { isAuthModalOpen, toggleAuthModal } = useAuthStore(
    useShallow((s) => ({
      isAuthModalOpen: s.isAuthModalOpen,
      toggleAuthModal: s.toggleAuthModal,
    })),
  );
  const { data: session } = authClient.useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 right-0 w-full h-15 z-50 px-5 py-2 flex justify-between items-center bg-background">
        <div>
          <Button variant="ghost" onClick={() => setIsMenuOpen((v) => !v)}>
            <Menu />
          </Button>
        </div>
        <div>
          <Link href="/" className="text-xl">
            Joli
          </Link>
        </div>
        <div className="flex gap-4">
          {/* <Search /> */}
          {/* <ShoppingCart /> */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleAuthModal}
          >
            {session ? <User /> : <LogIn />}
          </Button>
        </div>
      </header>

      {isAuthModalOpen &&
        (session ? (
          <div className="fixed top-15 right-0 z-40 p-2 pt-2 mr-2 rounded-b-lg bg-background">
            <Button onClick={async () => await authClient.signOut()}>
              {t("signOut")}
            </Button>
          </div>
        ) : (
          <div
            className="fixed top-0 right-0 z-10 w-full h-screen bg-background/90 flex flex-col justify-center"
            onClick={() => toggleAuthModal()}
          >
            <AuthForm />
          </div>
        ))}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-50  bg-black/50 backdrop-blur-sm"
        >
          <div className="w-fit h-full bg-background flex flex-col gap-2 py-8 px-4">
            {categoriesList.map((category) => (
              <Link key={category.href} href={`/products${category.href}`}>
                {t(category.title)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const categoriesList = [
  { title: "bestSeller", href: "?sort=bestseller" },
  { title: "newest", href: "?sort=newest" },
  { title: "colognes", href: "?category=colognes" },
  { title: "candle", href: "?category=candle" },
  { title: "body-hand-wash", href: "?category=body-hand-wash" },
  { title: "diffusers-refills", href: "?category=diffusers-refills" },
];
