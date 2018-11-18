import * as React from 'react';
import { Route } from 'react-router';
import { BasePageComponent } from '../base/basePageComponent';
import TrucksList  from './trucks-list';
import CarrierAddTruck from './create-truck';


class TrucksWrapper extends React.Component {
  public render() {
    return (
      <div>
        <TrucksList/>
      </div>

    );
  }
}

export default class TrucksModule extends BasePageComponent<any, any> {
   pageMeta = {
     title : 'Перевозчик',
   };


   public render(){
        return(
            <div>
                <Route path='/app/trucks'
                       component={TrucksWrapper}
                       exact={true} />
            </div>
        );
    }
} 