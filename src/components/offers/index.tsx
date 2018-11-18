import * as React from 'react';
import  OffersList from './offers-list';
import  CreateOffer from './create-offer';
import { Route } from 'react-router';
import { BasePageComponent } from '../base/basePageComponent';
import ErrorBoundary from '../UI/ErrorBoundary';

export default class OffersModule extends BasePageComponent<any, any> {
   pageMeta = {
     title : 'Offers',
   };


   public render(){
        return(
            <ErrorBoundary>
                <Route exact={true} path='/app/offers' component={OffersList} />
            </ErrorBoundary>
        );
    }
}
