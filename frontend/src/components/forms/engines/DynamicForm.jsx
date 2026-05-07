// // DynamicForm.jsx
// import { useForm } from "react-hook-form";
// import FieldRenderer from "./FieldRenderer";
// import useFilePreview from "../form-components/hooks/useFilePreview";
// import PrimaryButton from "../../shared/components/PrimaryButton";
// import useConditionalFields from "../form-components/hooks/useConditionalFields";
// import { useEffect } from "react";

// const DynamicForm = ({
//   config,
//   defaultValues = {},
//   values,
//   onSubmit,
//   handleUpload,
//   loading,
//   mode,
//   hideSubmit = false,
// }) => {
//   const formMethods = useForm({ defaultValues });
//   const {
//     handleSubmit,
//     watch,
//     control,
//     reset,
//     formState: { errors },
//   } = formMethods;

//   const visibleFields = useConditionalFields(config, formMethods); // Pass formMethods
//   const watchedValues = watch();
//   const previews = useFilePreview(watchedValues);

//   if (!config || !Array.isArray(config.fields)) {
//     return <p className="text-red-600">Invalid configuration provided.</p>;
//   }

//   useEffect(() => {
//     if (values) {
//       reset(values);
//     }
//   }, [values, reset]);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
//       {config.title && (
//         <h2 className="text-xl font-semibold my-5">{config.title}</h2>
//       )}

//       <div
//         className={
//           mode === "modal"
//             ? "flex flex-col w-full"
//             : "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2"
//         }
//       >
//         {config.fields.map((field) =>
//           visibleFields[field.name] ? (
//             <FieldRenderer
//               key={field.name}
//               field={field}
//               formMethods={formMethods}
//               previews={previews}
//               handleUpload={handleUpload}
//               loading={loading}
//               watch={watch}
//               visibleFields={visibleFields}
//               errors={errors}
//             />
//           ) : null,
//         )}
//       </div>
//       {!hideSubmit && (
//         <div className="w-full flex justify-center">
//           <PrimaryButton
//             type="submit"
//             disabled={loading}
//             text={loading ? "Processing..." : config.buttonText || "Submit"}
//             className="w-48 mt-4"
//           />
//         </div>
//       )}
//     </form>
//   );
// };

// export default DynamicForm;

import { useForm } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import useFilePreview from "../form-components/hooks/useFilePreview";
import PrimaryButton from "../../shared/components/PrimaryButton";
import useConditionalFields from "../form-components/hooks/useConditionalFields";
import { useEffect } from "react";

const DynamicForm = ({
  config,
  defaultValues = {},
  values,
  onSubmit,
  handleUpload,
  loading,
  mode,
  hideSubmit = false,
}) => {
  const formMethods = useForm({ defaultValues });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = formMethods;

  const visibleFields = useConditionalFields(
    config,
    formMethods,
  );

  const watchedValues = watch();

  const previews = useFilePreview(watchedValues);

  if (!config || !Array.isArray(config.fields)) {
    return (
      <p className="text-red-600">
        Invalid configuration provided.
      </p>
    );
  }

  useEffect(() => {
    if (values) {
      reset(values);
    }
  }, [values, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col overflow-x-hidden"
    >
      {config.title && (
        <h2 className="my-4 sm:my-5 text-lg sm:text-xl font-semibold break-words">
          {config.title}
        </h2>
      )}

      <div
        className={
          mode === "modal"
            ? "flex w-full flex-col gap-3"
            : "grid w-full grid-cols-1 gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4 lg:grid-cols-2"
        }
      >
        {config.fields.map((field) =>
          visibleFields[field.name] ? (
            <div
              key={field.name}
              className="w-full min-w-0"
            >
              <FieldRenderer
                field={field}
                formMethods={formMethods}
                previews={previews}
                handleUpload={handleUpload}
                loading={loading}
                watch={watch}
                visibleFields={visibleFields}
                errors={errors}
              />
            </div>
          ) : null,
        )}
      </div>

      {!hideSubmit && (
        <div className="mt-5 flex w-full justify-center">
          <PrimaryButton
            type="submit"
            disabled={loading}
            text={
              loading
                ? "Processing..."
                : config.buttonText || "Submit"
            }
            className="w-full sm:w-48"
          />
        </div>
      )}
    </form>
  );
};

export default DynamicForm;