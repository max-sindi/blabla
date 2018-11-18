export const findValue = (currentElement: string, userData: any[]) => {
    const finded = userData.find((element: any) => {
      return element.sysname === currentElement;
    });
    return finded ? finded.value : null;
  };

 export const serialize = (template: any, userData: any[]) => {
    const result: any = {};
    for (const item of Object.keys(template)) {
      result[item] = findValue(template[item], userData);
    }
    return result;
  };
