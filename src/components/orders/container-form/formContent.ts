import {findProperty, updateProperty} from '../../../utils/field-list';
import IComponent from '../../UI/form/IComponent';
import logger from '../../../utils/logger';

const mapOptions = (options: any = []) => {
    return options.map((option: any) => {
        return {
            label: option.name,
            value: option.id
        };
    });
};

export const getFields = (types: any = [], lines: any = [], id: number): IComponent[] => {
    return [
        {
            sysname: 'trailerType',
            label: 'Тип контейра',
            value: '',
            type: 'select',
            valueList: mapOptions(types), // TODO:  Get from Api
            valid: false,
            pristine: false,
            validationRules: {
                required: true
            }
        },
        {
            sysname: 'adr',
            label: 'АДР',
            type: 'checkboxBoolean',
            valid: true,
            pristine: true,
        },
        {
            sysname: 'genset',
            label: 'Джинсет',
            type: 'checkboxBoolean',
            valid: true,
            visible: false,
            pristine: true,
        },
        {
            sysname: 'genset_temperature',
            label: 'Температура, °C',
            type: 'number',
            valid: true,
            visible: false,
            pristine: false,
            validationRules: {
                func: value => value >= -25 && value <= 25
            }
        },
        {
            sysname: 'unNumber',
            label: 'UN номер',
            value: '',
            type: 'text',
            valueList: [],
            visible: false,
            valid: false,
            pristine: false,
            validationRules: {
                required: true,
                func: value => value >= 1 && value <= 3500 && value.length === 4,
            }
        },
        {
            sysname: 'trailerLine',
            label: 'Линия контейнера',
            value: '',
            type: 'select',
            valueList: mapOptions(lines),
            valid: false,
            pristine: false,
            validationRules: {
                required: true
            }
        },
        {
            sysname: 'cargoName',
            label: 'Название груза',
            value: '',
            type: 'text',
            valueList: [],
            valid: false,
            pristine: false,
            validationRules: {
                required: true,
                func: value => value.length < 150 && /^[a-zA-Zа-яА-Я0-9\s_.-]*$/.test(value),
            }
        },
        {
            sysname: 'cargoWeight',
            label: 'Вес груза, кг',
            value: '',
            type: 'text',
            valueList: [],
            valid: false,
            pristine: false,
            validationRules: {
                required: true,
                func: weight => weight < 40000
            }
        },
        {
            sysname: 'packageType',
            label: 'Вид Упаковки',
            value: '',
            type: 'text',
            valueList: [],
            valid: true,
            pristine: true,
            validationRules: {
                func: value => value.length < 150 && /^[a-zA-Zа-яА-Я0-9\s_.-]*$/.test(value),
            }
        },
        {
            sysname: 'platfroLength',
            label: 'Размер Платформы',
            type: 'radio',
            valueList: [
                {label: 'Длинная', value: 'long'},
                {label: 'Короткая', value: 'short'}
            ],
            pristine: true,
        },
        {
            sysname: 'platfroProtection',
            label: 'Тип Платформы',
            type: 'radio',
            valueList: [
                {label: 'Зашитая', value: 'true'},
                {label: 'Незашитая', value: 'false'}
            ],
            pristine: true,
        },
        {
            sysname: 'isTelescopic',
            label: 'Телескопическая',
            type: 'checkboxBoolean',
            pristine: true,
        },
        {
            sysname: 'truckAxels',
            label: 'Количество осей на тягаче',
            type: 'radio',
            row: true,
            pristine: true,
            valueList: [
                {label: '2', value: '2'},
                {label: '3', value: '3'},
                {label: '4', value: '4'},
            ],
        },
        {
            sysname: 'trailerAxels',
            label: 'Количество осей на прицепе',
            type: 'radio',
            pristine: true,
            row: true,
            valueList: [
                {label: '2', value: '2'},
                {label: '3', value: '3'},
                {label: '4', value: '4'},
            ],
        },
        {
            sysname: 'price',
            label: 'Цена, $',
            type: 'text',
            valid: false,
            pristine: false,
            validationRules: {
                required: true,
                func: value => /^\d+$/.test(value)
            }
        }
    ];
};

const checkContainerType = (fields: any) => {
    const trailerType = findProperty('trailerType', fields);
    const trailerTypeValue = trailerType.value;
    const isGenset =
        (trailerType && trailerType.value === 4) ||
        (trailerType && trailerType.value === 10);
    const is40FT = trailerType && trailerType.value > 4 && trailerType.value <= 10;

    // check for temperature visibility;
    let updatedState = updateProperty('genset_temperature', fields, (prevState: IComponent) => {
        return {...prevState, visible: isGenset};
    });

    /*
      if trailerType = 45 or 45 FT, disable platformLenght&platformProtection,
      platformLenght value becomes 'long' and platformProtection value becomes null
    */
    updatedState = updateProperty('platfroLength', updatedState, (prevState: IComponent) => {
        return {...prevState, disabled: is40FT, value: is40FT ? 'long' : prevState.value};
    });
    updatedState = updateProperty('platfroProtection', updatedState, (prevState: IComponent) => {
        return {...prevState, disabled: is40FT};
    });


    return updateProperty('genset', updatedState, (prevState: IComponent) => {
        return {...prevState, visible: isGenset};
    });
};

const checkAdr = (fields: any) => {
    const adr = findProperty('adr', fields);
    const isChecked = (adr && adr.value) || false;
    return updateProperty('unNumber', fields, (prevState: IComponent) => {
        return {...prevState, visible: isChecked};
    });
};


export const fieldsBehaviour = (fields: IComponent[]) => {
    logger.debug(fields);
    let result = checkContainerType(fields);
    result = checkAdr(result);
    return result;
};

export const convertContainerFromServerToState = (container, types, lines) => {
    return container.map(cont => {
        return [
            {
                sysname: 'trailerType',
                label: 'Тип контейра',
                value: cont.type,
                type: 'select',
                valueList: mapOptions(types),
                valid: true,
                pristine: false,
                validationRules: {
                    required: true
                }
            },
            {
                sysname: 'adr',
                label: 'АДР',
                value: cont.is_adr,
                type: 'checkboxBoolean',
                valid: true,
                pristine: true,
            },
            {
                sysname: 'genset',
                label: 'Джинсет',
                type: 'checkboxBoolean',
                value: cont.is_genset,
                valid: true,
                visible: false,
                pristine: true,
            },
            {
                sysname: 'genset_temperature',
                label: 'Температура, °C',
                type: 'number',
                value: cont.genset_temperature,
                valid: true,
                visible: false,
                pristine: false,
                validationRules: {
                    func: value => value >= -25 && value <= 25
                }
            },
            {
                sysname: 'unNumber',
                label: 'UN номер',
                type: 'text',
                value: cont.un_number,
                valueList: [],
                visible: false,
                valid: true,
                pristine: false,
                validationRules: {
                    required: true,
                    func: value => value >= 1 && value <= 3500 && value.length === 4,
                }
            },
            {
                sysname: 'trailerLine',
                label: 'Линия контейнера',
                value: cont.line,
                type: 'select',
                valueList: mapOptions(lines),
                valid: true,
                pristine: false,
                validationRules: {
                    required: true
                }
            },
            {
                sysname: 'cargoName',
                label: 'Название груза',
                value: cont.cargo_description,
                type: 'text',
                valueList: [],
                valid: true,
                pristine: false,
                validationRules: {
                    required: true,
                    func: value => value.length < 150 && /^[a-zA-Zа-яА-Я0-9\s_.-]*$/.test(value),
                }
            },
            {
                sysname: 'cargoWeight',
                label: 'Вес груза, кг',
                value: cont.cargo_weight,
                type: 'text',
                valueList: [],
                valid: true,
                pristine: false,
                validationRules: {
                    required: true,
                    func: weight => weight < 40000
                }
            },
            {
                sysname: 'packageType',
                label: 'Вид Упаковки',
                value: cont.cargo_package,
                type: 'text',
                valueList: [],
                valid: true,
                pristine: true,
                validationRules: {
                    func: value => value.length < 150 && /^[a-zA-Zа-яА-Я0-9\s_.-]*$/.test(value),
                }
            },
            {
                sysname: 'platfroLength',
                label: 'Размер Платформы',
                type: 'radio',
                value: cont.trailer_type,
                valueList: [
                    {label: 'Длинная', value: 'long'},
                    {label: 'Короткая', value: 'short'}
                ],
                pristine: true,
            },
            {
                sysname: 'platfroProtection',
                label: 'Защита Платформы',
                value: (typeof cont.is_trailer_protected === 'boolean' && cont.is_trailer_protected.toString()) || '',
                type: 'radio',
                valueList: [
                    {label: 'Зашитая', value: 'true'},
                    {label: 'Незашитая', value: 'false'}
                ],
                pristine: true,
            },
            {
                sysname: 'isTelescopic',
                label: 'Телескопическая',
                value: cont.is_trailer_telescopic,
                type: 'checkboxBoolean',
                pristine: true,
            },
            {
                sysname: 'truckAxels',
                label: 'Количество осей на тягаче',
                type: 'radio',
                value: (cont.truck_axles && cont.truck_axles.toString()) || '',
                row: true,
                pristine: true,
                valueList: [
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                ],
            },
            {
                sysname: 'trailerAxels',
                label: 'Количество осей на контейнере',
                type: 'radio',
                value: (cont.trailer_axles && cont.trailer_axles.toString()) || '',
                pristine: true,
                row: true,
                valueList: [
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                ],
            },
            {
                sysname: 'price',
                label: 'Цена, $',
                value: cont.price.split('.')[0],
                type: 'text',
                valid: true,
                pristine: false,
                validationRules: {
                    required: true,
                    func: value => /^\d+$/.test(value)
                }
            },
            {
                sysname: 'uniqueId',
                // label: 'Цена, $',
                value: cont.id,
                type: 'text',
                visible: false,
                pristine: false,
            },
        ];
    });
};
