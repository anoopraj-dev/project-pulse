// hooks/useConditionalFields.js
import { useWatch } from 'react-hook-form';

const useConditionalFields = (config, formMethods) => {
  const { control } = formMethods;
  const watchedValues = useWatch({ control }) || {};
  
  const visibleFields = {};

  const evaluateCondition = (condition, values) => {
    if (!condition || !condition.dependsOn) return true;
    
    const dependsValue = values[condition.dependsOn];
    
    // Handle checkbox arrays properly
    if (Array.isArray(dependsValue)) {
      if (condition.type === 'includes') {
        return dependsValue.includes(condition.value);
      }
      if (condition.type === 'notEmpty') {
        return dependsValue.length > 0;
      }
      return dependsValue.length > 0; // Default: show if any checked
    }
    
    // Non-array fields
    if (condition.type === 'equals') {
      return dependsValue === condition.value;
    }
    
    if (condition.type === 'notEmpty') {
      return !!dependsValue;
    }
    
    // Default: exact match
    return dependsValue === condition.value;
  };

  config.fields.forEach(field => {
    visibleFields[field.name] = evaluateCondition(field.condition, watchedValues);
  });

  return visibleFields;
};

export default useConditionalFields;
