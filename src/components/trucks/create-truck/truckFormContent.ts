import {findProperty, updateProperty} from '../../../utils/field-list';
import IComponent from '../../UI/form/IComponent';
import {ITrailerInfo, ITruckInfo} from "../../../actions/trucks";
import {serialize} from "../../../utils/serialize";

const mapOptions = (options: any) => {
  return options.map((option: any) => {
    return {
      label: option.name,
      value: option.id
    };
  });
};


export const truckFormFields: IComponent[] = [
  {
    sysname: 'registration_number',
    label: 'Регистрационный номер',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    }
  },
  {
    sysname: 'technical_passport',
    label: 'Технический пасспорт',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    }
  },
  {
    sysname: 'brand',
    label: 'Производитель',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    }
  },
  {
    sysname: 'color',
    label: 'Цвет',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    }
  },
  {
    sysname: 'axles',
    label: 'Количество осей',
    type: 'radio',
    valueList: [
      {label: '2 оси', value: '2'},
      {label: '3 оси', value: '3'},
      {label: '4 оси', value: '4'},
    ],
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    },
    row: true,
  },
];

// TRAILER DATA:
export const trailerFormFields: IComponent[] = [
  {
    sysname: 'trailer_registration_number',
    label: 'Прицеп:  Номер',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    }
  },
  {
    sysname: 'trailer_technical_passport',
    label: 'Прицеп: Техпасспорт',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    }
  },
  {
    sysname: 'trailer_brand',
    label: 'Прицеп: Производитель',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    }
  },
  {
    sysname: 'trailer_color',
    label: 'Прицеп: Цвет',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    }
  },
  {
    sysname: 'trailer_load_capacity',
    label: 'Прицеп: Грузоподъёмность',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true,
    }
  },
  {
    sysname: 'trailer_axles',
    label: 'Прицеп: Количество осей',
    type: 'radio',
    valueList: [
      {label: '2 оси', value: '2'},
      {label: '3 оси', value: '3'},
      {label: '4 оси', value: '4'},
    ],
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    },
    row: true,
  },
  {
    sysname: 'trailer_type',
    label: 'Прицеп: Размер Платформы',
    type: 'radio',
    valueList: [
      {label: 'Длинная платформа', value: 'long'},
      {label: 'Короткая платформа', value: 'short'}
    ],
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true
    },
    row: true,
  },
  {
    sysname: 'trailer_is_protected',
    label: 'Прицеп: Зашит',
    type: 'checkboxBoolean',
    // valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: false
    }
  },
  {
    sysname: 'trailer_is_telescopic',
    label: 'Прицеп: Телескопичный',
    type: 'checkboxBoolean',
    // valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: false
    },
  },
];


export const trailerFields = {
  registration_number: 'trailer_registration_number',
  technical_passport: 'trailer_technical_passport',
  brand: 'trailer_brand',
  color: 'trailer_color',
  load_capacity: 'trailer_load_capacity',
  axles: 'trailer_axles',
  type: 'trailer_type',
  is_protected: 'trailer_is_protected',
  is_telescopic: 'trailer_is_telescopic',
};


export const truckFields = {
  // name: 'name',
  brand: 'brand',
  color: 'color',
  registration_number: 'registration_number',
  technical_passport: 'technical_passport',
  axles: 'axles',
};

export const convertFieldsToTruckInfo = (truckData: IComponent[], trailerData: IComponent[], propsTruck: any = null) => {
  const data = {
    ...serialize(truckFields, truckData),
    trailer: serialize(trailerFields, trailerData),
  };

  if (propsTruck) {
    data.id = propsTruck.id;
  }

  return data;
};


export const convertTruckInfoToFields = (truck: ITruckInfo) : IComponent[][] => {
  const fields = [];
  const truckFields = truckFormFields;
  const trailerFields = trailerFormFields;

  truckFields.forEach(field => {
    field.pristine = true;
    field.valid = true;
    switch (field.sysname) {
      case 'registration_number':
        field.value = truck.registration_number;
        break;
      case 'technical_passport':
        field.value = truck.technical_passport;
        break;
      case 'brand':
        field.value = truck.brand;
        break;
      case 'color':
        field.value = truck.color;
        break;
      case 'axles':
        field.value = truck.axles.toString();
        break;
    }
  });

  trailerFields.forEach(field => {
    field.pristine = true;
    field.valid = true;
    switch (field.sysname) {
      case 'trailer_registration_number':
        field.value = truck.trailer.registration_number;
        break;
      case 'trailer_technical_passport':
        field.value = truck.trailer.technical_passport;
        break;
      case 'trailer_brand':
        field.value = truck.trailer.brand;
        break;
      case 'trailer_color':
        field.value = truck.trailer.color;
        break;
      case 'trailer_load_capacity':
        field.value = truck.trailer.load_capacity;
        break;
      case 'trailer_axles':
        field.value = truck.trailer.axles.toString();
        break;
      case 'trailer_type':
        field.value = truck.trailer.type;
        break;
      case 'trailer_is_protected':
        field.value = truck.trailer.is_protected;
        break;
      case 'trailer_is_telescopic':
        field.value = truck.trailer.is_telescopic;
        break;
    }
  });


  fields[0] = truckFields;
  fields[1] = trailerFields;

  return fields;
};

