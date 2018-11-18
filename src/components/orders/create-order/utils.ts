import IComponent from '../../UI/form/IComponent';
import { findProperty, updateProperty } from '../../../utils/field-list';
import * as chance from 'chance';

export const addIdField = (container: IComponent[]) => {
  let uniqueId = findProperty('uniqueId', container);
  if (!uniqueId) {
    container.push({
      sysname: 'uniqueId',
      value: chance().guid(),
      visible: false
    });
  }else{
    container = updateProperty('uniqueId', container, (component)=>{
        component.value = chance().guid();
        return {...component};
    });
  }
  return [...container];
};

export const concatContainers = (state: any, containers: any) => {
  const withUniqueIds =  containers.map((container: IComponent[]) => {
    return addIdField(container);
  });

  return state.concat(withUniqueIds);
};

export const updateContainer = (containers:any, update: any)=>{
     return containers.map((container:any)=>{
          if(findProperty('uniqueId',container).value === findProperty('uniqueId',update).value){
            return update;
          }
          return container;
      })
}
