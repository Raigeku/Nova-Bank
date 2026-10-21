import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-brand grid h-8 w-8 place-items-center rounded-full text-sm text-white">n</span>
            nova
          </div>
          <p className="mt-3 text-sm text-muted">{t("tagline")}</p>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/personal" className="hover:text-accent">{nav("personal")}</Link>
          <Link href="/business" className="hover:text-accent">{nav("business")}</Link>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-10 text-xs text-muted sm:px-6">{t("legal")}</p>
    </footer>
  );
}
