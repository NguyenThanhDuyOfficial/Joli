"use client";

import { Button } from "@nguyenthanhduyofficial/ui/components/button";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AuthForm from "./AuthForm";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setIsOpen((v) => !v)}
          >
            <User />
          </Button>
        </div>
      </header>
      {isOpen && (
        <div className="fixed top-0 right-0 z-40 w-full h-screen bg-background/90 flex flex-col justify-center">
          {" "}
          <AuthForm />{" "}
        </div>
      )}
    </>
  );
}
