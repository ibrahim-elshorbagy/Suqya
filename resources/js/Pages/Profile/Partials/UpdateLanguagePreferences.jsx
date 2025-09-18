import { usePage, router } from "@inertiajs/react";
import { useEffect } from "react";
import { useTrans } from "@/Hooks/useTrans";
import SelectInput from "@/Components/SelectInput";

export default function UpdateLanguagePreferences() {
  const { locale } = usePage().props;
  const { t } = useTrans();

  const handleLanguageChange = (e) => {
    const newLocale = e.target.value;

    // router.post(
    //   route("locale.change"),
    //   { locale: newLocale },
    //   { preserveScroll: true }
    // );
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {t("language")}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {t("change_language")}
        </p>
      </header>

      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("current_language")}:{" "}
            {locale === "en" ? t("english") : t("arabic")}
          </label>

          <SelectInput
            name="locale"
            value={locale}
            onChange={handleLanguageChange}
            options={[
              { value: "en", label: t("english") },
              { value: "ar", label: t("arabic") },
            ]}
            icon="fa-language"
            required
          />
        </div>
      </div>
    </section>
  );
}
