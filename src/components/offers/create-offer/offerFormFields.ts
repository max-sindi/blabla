import {findProperty, updateProperty} from '../../../utils/field-list';
import {IOffer, IOfferCreation, IOfferLocation} from "../../../actions/offers";
import IComponent from '../../UI/form/IComponent';
import {findValue, serialize} from "../../../utils/serialize";
import {IPlaceData} from "../../UI/address-input/index";
import GeocoderResult = google.maps.GeocoderResult;
import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

const mapOptions = (options: any) => {
  return options.map((option: any) => {
    return {
      label: option.name,
      value: option.id
    };
  });
};


export const containerFieldsNames: string[] = [
  'container',
  'container_line',
];


export const truckFieldsNames: string[] = [
  'truck_axles',
  'trailer_load_capacity',
  'trailer_axles',
  'trailer_type',
  'trailer_is_protected',
  'trailer_is_telescopic',
];


export const offerFormFields: IComponent[] = [
  {
    sysname: 'has_truck',
    label: '',
    type: 'checkboxBoolean',
    visible: true,
    pristine: true,
    value: true,
    className: 'inline',
    inline: true,
  },
  {
    sysname: 'truck',
    label: 'Машина',
    type: 'select',
    valid: true,
    visible: true,
    pristine: true,
    valueList: [
      // will be filled with trucksList
    ],
    validationRules: {
      required: false,
    },
    className: 'inline',
    inline: true,
    width: 'xxl',
  },
  // truck & trailer properties
  {
    sysname: 'truck_axles',
    label: 'Кол-во осей, тягач',
    type: 'radio',
    valueList: [
      {label: '2 оси', value: '2'},
      {label: '3 оси', value: '3'},
      {label: '4 оси', value: '4'},
    ],
    // valid: false,
    visible: false,
    pristine: true,
    validationRules: {
      required: false
    },
    row: true,
  },
  {
    sysname: 'trailer_load_capacity',
    label: 'Грузоподъёмность',
    type: 'text',
    // valid: false,
    visible: false,
    pristine: true,
    validationRules: {
      required: false,
    }
  },
  {
    sysname: 'trailer_axles',
    label: 'Кол-во осей, прицеп',
    type: 'radio',
    valueList: [
      {label: '2 оси', value: '2'},
      {label: '3 оси', value: '3'},
      {label: '4 оси', value: '4'},
    ],
    // valid: false,
    visible: false,
    pristine: true,
    validationRules: {
      required: false
    },
    row: true,
  },
  {
    sysname: 'trailer_type',
    label: 'Размер платформы',
    type: 'radio',
    valueList: [
      {label: 'Длинная платформа', value: 'long'},
      {label: 'Короткая платформа', value: 'short'}
    ],
    // valid: false,
    visible: false,
    pristine: true,
    validationRules: {
      required: false
    },
    row: true,
  },
  {
    sysname: 'trailer_is_protected',
    label: 'Прицеп зашит',
    type: 'checkboxBoolean',
    visible: false,
    pristine: true,
    validationRules: {
      required: false
    }
  },
  {
    sysname: 'trailer_is_telescopic',
    label: 'Прицеп телескопичный',
    type: 'checkboxBoolean',
    visible: false,
    pristine: true,
    validationRules: {
      required: false
    }
  },
  // offer properties continues
  {
    sysname: 'has_container',
    label: '',
    type: 'checkboxBoolean',
    visible: true,
    pristine: true,
    value: true,
    inline: true,
    lineBreak: true,
  },
  {
    sysname: 'container',
    label: 'Контейнер',
    type: 'select',
    valid: false,
    visible: true,
    pristine: true,
    valueList: [
      // will be filled with containerTypeList
    ],
    validationRules: {
      required: true,
    },
    inline: true,
    lineBreak: true,
    width: 'xxl',
  },
  {
    sysname: 'container_line',
    label: 'Линия',
    type: 'select',
    valid: false,
    visible: true,
    pristine: true,
    valueList: [
      // will be filled with containerLineLisxt
    ],
    validationRules: {
      required: true,
    },
  },
  {
    sysname: 'location',
    label: 'Местоположение',
    type: 'address-input',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true,
    },
  },
  {
    sysname: 'radius',
    label: 'Радиус переезда, км',
    type: 'text',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true,
    },
  },
  {
    sysname: 'date',
    label: 'Дата',
    type: 'date',
    valid: false,
    visible: true,
    pristine: true,
    validationRules: {
      required: true,
    },
  },
];


export const convertPlaceToOfferLocation = (place: IPlaceData): IOfferLocation => {
  return {
    country: place.country,
    region: place.region,
    city: place.city,
    address: place.address,
    point : {
      type: 'Point',
      coordinates: place.latLng.split(',').map(s => parseFloat(s)),
    },
  };
};


export const convertOfferLocationToPlace = (location: IOfferLocation): IPlaceData => {
  return {
    country: location.country,
    region: location.region,
    city: location.city,
    address: location.address,
    latLng: location.point.coordinates[0] + ',' + location.point.coordinates[1],
  };
};



export const convertFieldsToOfferInfo = (data: IComponent[], offer?: IOffer) : IOfferCreation => {
  const obj: IOfferCreation = {
    location : convertPlaceToOfferLocation(findValue('location', data)),
    container : {
      type : findValue('container', data),
      line : findValue('container_line', data),
    },
    radius : findValue('radius', data),
    date : findValue('date', data).toString() + 'T12:00',
  };

  const truckId = findValue('truck', data);
  if (truckId) {
    obj.truck = truckId;
  } else {
    obj.axles =  findValue('truck_axles', data);
    obj.load_capacity = findValue('trailer_load_capacity', data);
    obj.trailerAxles =  findValue('trailer_axles', data);
    obj.type =  findValue('trailer_type', data);
    obj.is_protected =  findValue('trailer_is_protected', data);
    obj.is_telescopic =  findValue('trailer_is_telescopic', data);
  }

  // if we update existing offer
  if (offer) {
    obj.id = offer.id;
    obj.container.id = offer.container.id;
  }

  return obj;
};


export const findField = (fieldName, fields) : any => {
  return fields.find(el => el.sysname === fieldName);
};


export const recordByLabel = (valueList, label) : any => {
  return valueList.find(el => el.label === label);
};


export const containerTypeIdByStr = (containerTypeStr) => {
  const c = findField('container',  offerFormFields);

  const rec = recordByLabel(c.valueList, containerTypeStr);
  return rec ? rec.value : null;
};

export const containerLineIdByStr = (containerLineStr) => {
  const c = findField('container_line',  offerFormFields);

  const rec = recordByLabel(c.valueList, containerLineStr);
  return rec ? rec.value : null;
};



export const convertOfferInfoToFields = (offer: IOffer) : IComponent[] => {
  const fields = offerFormFields;

  fields.forEach(field => {
    field.pristine = true;
    field.valid = true;
    switch(field.sysname) {
      case 'truck':
        field.value = offer.truck ? offer.truck.id : null;
      break;
      case 'location':
        field.value = convertOfferLocationToPlace(offer.location);
      break;
      case 'container':
        field.value = offer.container ? containerTypeIdByStr(offer.container.type) : null;
      break;
      case 'container_line':
        field.value = offer.container ? containerLineIdByStr(offer.container.line) : null;
      break;
      case 'radius':
        field.value = offer.radius;
      break;
      case 'date':
        field.value =  offer.date.slice(0, 10);
      break;
    }
  });

  return fields;
};
