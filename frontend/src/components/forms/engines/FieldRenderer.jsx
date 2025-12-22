
import FieldArrayGroup from "./FieldArrayGroup";
import TextInput from "../form-components/fields/TextInput";
import SelectInput from "../form-components/fields/SelectInput";
import FileInput from "../form-components/fields/FileInput";
import CheckboxGroup from "../form-components/fields/CheckboxGroup";
import RadioGroup from "../form-components/fields/RadioGroup";
import TextArea from "../form-components/fields/TextArea";
import GroupField from "../form-components/fields/GroupField";
import Titles from "../form-components/fields/Titles";


export default function FieldRenderer({ field, formMethods, handleUpload, previews, watch, loading,visibleFields}) {
  const {register, formState: { errors },control,getValues} = formMethods;
  

  const components = {
    text: TextInput,
    select: SelectInput,
    file: FileInput,
    checkbox: CheckboxGroup,
    radio: RadioGroup,
    textarea: TextArea,
    repeatable: FieldArrayGroup,
    group: GroupField,
    title: Titles
  };

  const Component = components[field.type] || TextInput;

  const modifiedField = 
    field.type === 'file' ?
     {
      ...field,
      getValue: getValues
     } : field

  return (
    <Component
      field={modifiedField}
      formMethods={formMethods}
      register={register}
      control={control}
      errors={errors}
      handleUpload={handleUpload}
      previews={previews}
      watch={watch}
      loading={loading}
      visibleFields={visibleFields}
    />
  );
}
