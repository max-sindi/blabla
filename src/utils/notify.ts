import Alert from 'react-s-alert';

const alertConf: any = {
  position: 'top-right',
  html: true,
  beep: false,
  timeout: 4000,
  offset: 100,
};

export enum ENotifyType {
  warning = 'warning',
  success = 'success',
  info = 'info',
  error = 'error',
}

export default function notify(type: any, title: string, text: string = null) {
  switch (type) {
    case ENotifyType.success :
      notifySuccess(title, text);
      break;
    case ENotifyType.info :
      notifyInfo(title, text);
      break;
    case ENotifyType.warning :
      notifyWarning(title, text);
      break;
    case ENotifyType.error :
      notifyError(title, text);
      break;
  }
};

const notifySuccess = (title: string, text: string) => {
  Alert.success(makeNotifyHtml(title, text), alertConf);
};

const notifyInfo = (title: string, text: string) => {
  Alert.info(makeNotifyHtml(title, text), alertConf);
};


const notifyWarning = (title: string, text: string) => {
  Alert.warn(makeNotifyHtml(title, text), alertConf);
};


const notifyError = (title: string, text: string) => {
  Alert.error(makeNotifyHtml(title, text), alertConf);
};

const makeNotifyHtml = (title, text) => {
  const textHtml = text ? `<p>${text}</p>` : '';
  return `<p style="font-weight: bolder;">${title}</p>` + textHtml;
};