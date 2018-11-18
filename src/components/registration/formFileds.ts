import { inputWrap } from './style.css'

// you can find adding classNames after declaration this
export const formFields  = [
    {
      sysname: 'userName',
      label: 'Имя',
      value: '',
      type: 'text',
      valid: false,
      pristine: true,
      validationRules: {
        required: true
      },
    },
    {
      sysname: 'userSurname',
      label: 'Фамилия',
      type: 'text',
      value: '',
      valid: false,
      pristine: true,
      validationRules: {
        required: true
      }
    },
    {
      sysname: 'carrierName',
      label: 'Название перевозчика',
      type: 'text',
      value: '',
      valid: false,
      pristine: true,
      validationRules: {
        required: true
      }
    },
    {
      sysname: 'email',
      label: 'Электронная Почта',
      type: 'email',
      valid: false,
      value: '',
      pristine: true,
      validationRules: {
        required: true
      },
      disableIcon: true,
    },
    {
      sysname: 'phoneNumber',
      label: 'Номер Телефона',
      type: 'phone',
      valid: false,
      value: '',
      pristine: true,
      validationRules: {
        required: true
      },
      disableIcon: true,
    },
    {
      sysname: 'password',
      label: 'Пароль',
      type: 'password',
      value: '',
      valid: false,
      pristine: true,
      validationRules: {
        required: true
      }
    },
    {
      sysname: 'confirm',
      label: 'Подтвердите Пароль',
      type: 'password',
      value: '',
      valid: false,
      pristine: true,
      validationRules: {
        required: true,
        confirm: 'password'
      }
    }
  ];

formFields.forEach(item => item['className'] = inputWrap)
