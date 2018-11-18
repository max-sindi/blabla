import * as React from 'react';
import  OrdersMain from './orders-main';
import  CreateOrder from './create-order';
import  OrderProfile from './order-profile';
import EditOrder from './edit-order';
import { Route } from 'react-router';
import { BasePageComponent } from '../base/basePageComponent';

export default class Orders extends BasePageComponent<any, any> {
   pageMeta = {
     title : 'Orders',
   }


   public render(){
        return(
            <div>
                <Route exact={true} path='/app/orders/' component={OrdersMain} />
                <Route path='/app/orders/create' component={CreateOrder} />
                <Route path='/app/orders/profile/:id' component={OrderProfile} />
                <Route path='/app/orders/edit/:id' component={EditOrder} />
            </div>
  );
    }
}
