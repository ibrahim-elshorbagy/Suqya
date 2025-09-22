import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { useTrans } from "@/Hooks/useTrans";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function UpdateLogoForm({ tenant, className = "" }) {
  const { t } = useTrans();
  const fileInput = useRef();

  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    logo: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('logo', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = (e) => {
    e.preventDefault();

    post(route("tenant.logo.update"), data, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        reset('logo');
        setPreviewUrl(null);
        if (fileInput.current) {
          fileInput.current.value = "";
        }
      },
    });
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {t("company_logo")}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {t("update_company_logo")}
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="logo" value={t("company_logo")} />

          <div className="mt-2 flex items-center gap-6">
            {/* Current Logo */}
            {tenant?.logo ? (
              <div>
                <img
                  src={`/storage/${tenant.logo}`}
                  alt={tenant.name}
                  className="h-20 w-20 rounded-lg object-cover border-2 border-neutral-200 dark:border-neutral-700"
                />
              </div>
            ) : (
              <div className="h-20 w-20 text-white rounded-lg bg-blue-200 dark:bg-blue-700 flex items-center justify-center">
                <span className="text-neutral-500 dark:text-neutral-400 text-2xl">
                  <i className="fa-solid fa-building"></i>
                </span>
              </div>
            )}

            {/* Preview New Logo */}
            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover border-2 border-blue-400 dark:border-blue-600"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <input
              id="logo"
              type="file"
              ref={fileInput}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />

            <label
              htmlFor="logo"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
            >
              <i className="fas fa-upload"></i>
              {t("choose_file")}
            </label>

            <InputError message={errors.logo} className="mt-2" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {data.logo && (
            <PrimaryButton
              type="submit"
              disabled={!data.logo || processing}
            >
              {processing ? t("uploading") : t("save_changes")}
            </PrimaryButton>
          )}

          {recentlySuccessful && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {t("saved_successfully")}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
