import { Controller } from "react-hook-form";
import FieldArrayGroup from "./FieldArrayGroup";
import TextInput from "../form-components/fields/TextInput";
import SelectInput from "../form-components/fields/SelectInput";
import FileInput from "../form-components/fields/FileInput";
import CheckboxGroup from "../form-components/fields/CheckboxGroup";
import RadioGroup from "../form-components/fields/RadioGroup";
import TextArea from "../form-components/fields/TextArea";
import GroupField from "../form-components/fields/GroupField";
import Titles from "../form-components/fields/Titles";

export default function FieldRenderer({ field, formMethods, visibleFields }) {
  const {
    control,
    formState: { errors },
  } = formMethods;

  const components = {
    text: TextInput,
    select: SelectInput,
    checkbox: CheckboxGroup,
    radio: RadioGroup,
    textarea: TextArea,
    repeatable: FieldArrayGroup,
    group: GroupField,
    title: Titles,
  };

  // ---------------- FILE FIELD ----------------
  if (field.type === "file") {
    return (
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.multiple ? [] : null}
        rules={field.validation}
        render={({ field: controllerField }) => (
          <FileInput
            field={field}
            value={controllerField.value}
            onChange={controllerField.onChange}
            error={errors[field.name]}
          />
        )}
      />
    );
  }

  // ---------------- OTHER FIELDS ----------------
  const Component = components[field.type] || TextInput;

  return (
    <Component
      field={field}
      formMethods={formMethods}
      errors={errors}
      visibleFields={visibleFields}
    />
  );
}
