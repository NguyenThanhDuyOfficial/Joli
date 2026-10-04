import { Menu, Search, ShoppingCart } from 'lucide-react';
export default function Header() {
  return (
    <header className="h-15 px-5 py-2 flex justify-between items-center bg-background">
      <div>
        <Menu />
      </div>
      <div>Joli</div>
      <div className="flex gap-4">
        <Search />
        <ShoppingCart />
      </div>
    </header>
  );
}
