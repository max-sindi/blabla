import IValidationRules from '../components/UI/form/IValidationRules';
import IComponent from '../components/UI/form/IComponent';
type IValue = any;

export function validate(
  value: IValue,
  validationRules: IValidationRules,
  fields: IComponent[]
) {
  const rules = {
    required: (value: IValue, required: boolean) => {
      if (!required) {
        return true;
      }
      switch (typeof value) {
        case 'number':
          return true;
        case 'string':
          return value && value.length > 0;
        default:
          return !!value;
      }
    },
    confirm: (value: IValue, fieldName: string, fields: IComponent[]) => {
      const finded = fields.find((element) => {
        return element.sysname === fieldName;
      });
      return finded && finded.value === value;
    },
    func: (value: IValue, func: any) => func(value)
  };

  for (const rule in validationRules) {
    const isValidRule = rules[rule](value, validationRules[rule], fields);
    if (!isValidRule) {
      return {valid: false, rule};
    }
  }
  return { valid: true };
}

const messages = {
  required: 'Это обязательное поле.',
  confirm: 'Повотрите ввод.',
  func: 'Проверьте правильность данных.'
};

export const getMessage = (validationRules: any, rule: any) => {
  return messages[rule];
};
