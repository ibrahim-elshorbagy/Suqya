import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { useTrans } from "@/Hooks/useTrans";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function UpdateDocumentsForm({ tenant, className = "" }) {
  const { t } = useTrans();
  const commercialRegistrationInput = useRef();
  const professionLicenseInput = useRef();

  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    commercial_registration: null,
    profession_license: null,
  });

  const [previews, setPreviews] = useState({
    commercial_registration: null,
    profession_license: null,
  });

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(t('document_too_large'));
        e.target.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert(t('invalid_document_type'));
        e.target.value = '';
        return;
      }

      setData(field, file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({
            ...prev,
            [field]: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => ({
          ...prev,
          [field]: null
        }));
      }
    }
  };

  const submit = (e) => {
    e.preventDefault();

    post(route("tenant.documents.update", tenant.slug), data, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        reset();
        setPreviews({
          commercial_registration: null,
          profession_license: null,
        });
        if (commercialRegistrationInput.current) {
          commercialRegistrationInput.current.value = "";
        }
        if (professionLicenseInput.current) {
          professionLicenseInput.current.value = "";
        }
      },
    });
  };

  const clearFile = (field) => {
    setData(field, null);
    setPreviews(prev => ({
      ...prev,
      [field]: null
    }));
    if (field === 'commercial_registration' && commercialRegistrationInput.current) {
      commercialRegistrationInput.current.value = '';
    }
    if (field === 'profession_license' && professionLicenseInput.current) {
      professionLicenseInput.current.value = '';
    }
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {t("business_documents")}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {t("upload_business_documents_description")}
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        {/* Commercial Registration */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
          <InputLabel htmlFor="commercial_registration" value={t("commercial_registration")} />

          <div className="mt-3 flex items-start gap-6">
            {/* Current File */}
            {tenant?.commercial_registration ? (
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                  <i className="fa-solid fa-file-alt text-blue-600 dark:text-blue-400 text-2xl"></i>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{t('current_file')}</p>
                <a
                  href={`/storage/${tenant.commercial_registration}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {t('view_file')}
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  <i className="fa-solid fa-file-alt text-neutral-400 text-2xl"></i>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{t('no_file')}</p>
              </div>
            )}

            {/* Preview New File - Commercial Registration */}
            {previews.commercial_registration ? (
              <div className="flex flex-col items-center">
                <img
                  src={previews.commercial_registration}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover border-2 border-blue-400 dark:border-blue-600"
                />
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('new_file')}</p>
                <button
                  type="button"
                  onClick={() => clearFile('commercial_registration')}
                  className="text-xs text-red-600 hover:underline"
                >
                  {t('remove')}
                </button>
              </div>
            ) : data.commercial_registration && (
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center border-2 border-green-400 dark:border-green-600">
                  <i className="fa-solid fa-file-alt text-green-600 dark:text-green-400 text-2xl"></i>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('new_file')}</p>
                <button
                  type="button"
                  onClick={() => clearFile('commercial_registration')}
                  className="text-xs text-red-600 hover:underline"
                >
                  {t('remove')}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <input
              id="commercial_registration"
              type="file"
              ref={commercialRegistrationInput}
              className="hidden"
              onChange={(e) => handleFileChange('commercial_registration', e)}
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <label
              htmlFor="commercial_registration"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-upload"></i>
              {t("choose_commercial_registration")}
            </label>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {t('document_file_requirements')}
            </p>
            <InputError message={errors.commercial_registration} className="mt-2" />
          </div>
        </div>

        {/* Profession License */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
          <InputLabel htmlFor="profession_license" value={t("profession_license")} />

          <div className="mt-3 flex items-start gap-6">
            {/* Current File */}
            {tenant?.profession_license ? (
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                  <i className="fa-solid fa-file-alt text-blue-600 dark:text-blue-400 text-2xl"></i>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{t('current_file')}</p>
                <a
                  href={`/storage/${tenant.profession_license}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {t('view_file')}
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  <i className="fa-solid fa-file-alt text-neutral-400 text-2xl"></i>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{t('no_file')}</p>
              </div>
            )}

            {/* Preview New File - Profession License */}
            {previews.profession_license ? (
              <div className="flex flex-col items-center">
                <img
                  src={previews.profession_license}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover border-2 border-blue-400 dark:border-blue-600"
                />
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('new_file')}</p>
                <button
                  type="button"
                  onClick={() => clearFile('profession_license')}
                  className="text-xs text-red-600 hover:underline"
                >
                  {t('remove')}
                </button>
              </div>
            ) : data.profession_license && (
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center border-2 border-green-400 dark:border-green-600">
                  <i className="fa-solid fa-file-alt text-green-600 dark:text-green-400 text-2xl"></i>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('new_file')}</p>
                <button
                  type="button"
                  onClick={() => clearFile('profession_license')}
                  className="text-xs text-red-600 hover:underline"
                >
                  {t('remove')}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <input
              id="profession_license"
              type="file"
              ref={professionLicenseInput}
              className="hidden"
              onChange={(e) => handleFileChange('profession_license', e)}
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <label
              htmlFor="profession_license"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-upload"></i>
              {t("choose_profession_license")}
            </label>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {t('document_file_requirements')}
            </p>
            <InputError message={errors.profession_license} className="mt-2" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {(data.commercial_registration || data.profession_license) && (
            <PrimaryButton
              type="submit"
              disabled={processing}
              icon="fa-floppy-disk"
              rounded="rounded-lg"
              withShadow={false}
            >
              {processing ? t("uploading") : t("save_changes")}
            </PrimaryButton>
          )}

          {recentlySuccessful && (
            <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <i className="fa-solid fa-check"></i> {t("saved_successfully")}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
