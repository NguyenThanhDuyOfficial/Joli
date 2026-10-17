"use client";
import { useTranslations } from "next-intl";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@nguyenthanhduyofficial/ui/components/combobox";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function FilterBar() {
  const t = useTranslations("Products");
  const sortList = ["bestseller", "newest"];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "title";

  function handleSelect(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    router.push(`${pathname}?${params.toString()}`);
  }
  return (
    <div className="w-full flex px-2 py-4">
      <div className="max-w-50 ml-auto">
        <Combobox
          items={sortList}
          value={currentSort}
          onValueChange={handleSelect}
          itemToStringLabel={(value) => t(`sort.${value}`)}
        >
          <ComboboxInput placeholder={t("sort.title")} />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {t(`sort.${item}`)}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}
