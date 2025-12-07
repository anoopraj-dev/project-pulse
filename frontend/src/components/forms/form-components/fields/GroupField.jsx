

export default function GroupField({ field, formMethods, visibleFields, ...rest }) {
  return (
    <div className="space-y-2 border p-3 rounded-md">
      <label className="block text-lg font-semibold mb-2">{field.label}</label>

      {field.fields.map((sub) =>
        visibleFields[sub.name] ? (
          <FieldRenderer
            key={sub.name}
            field={sub}
            formMethods={formMethods}
            visibleFields={visibleFields}
            {...rest}
          />
        ) : null
      )}
    </div>
  );
}


