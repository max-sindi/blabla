import IComponent from '../components/UI/form/IComponent';

export const findProperty = (name: string, fields: IComponent[]) => {
  return fields.find((component: IComponent) => {
    return component.sysname === name;
  });
};

export const updateProperty = (name: string, fields: IComponent[], callback: (component?:IComponent)=> IComponent) => {
  return fields.map((component: IComponent) => {
     if(component.sysname === name){
        return callback(component);
     }
     return component;
  });
};
