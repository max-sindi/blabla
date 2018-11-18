import {
    SET_NEW_OFFERS_FOR_ORDER_PROFILE,
    SET_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE,
    CLEAR_NEW_OFFERS_FOR_ORDER_PROFILE,
    CLEAR_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE,
    SHOW_LOADING_ICON_NEW_OFFERS,
    SHOW_LOADING_ICON_OFFERS_IN_CONSIDERATION,
} from '../actions/offers-for-order-profile';


const initState = {
    offers: [],
    container_id: '',
    showLoadingIcon: false
};

export const newOffersForOrderProfile = (state = initState, action) => {
    switch (action.type) {
        case SET_NEW_OFFERS_FOR_ORDER_PROFILE:
            return { ...state,
                offers: action.offers,
                container_id: action.container_id
            };
        case CLEAR_NEW_OFFERS_FOR_ORDER_PROFILE:
            return initState;
        case SHOW_LOADING_ICON_NEW_OFFERS:
            return { ...state,
                showLoadingIcon: action.payload
            };
        default:
            return state;
    }
};

export const offersInConsiderationForOrderProfile = (state = initState, action) => {
    switch (action.type) {
        case SET_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE: {
            for (let i = 0; i < action.offers.length; i++) {
                if (action.offers[i].state === 'accepted') {
                    const removed = action.offers.splice(i, 1);
                    action.offers.splice(0, 0, removed[0]);
                }
            }
            return {...state,
                offers: action.offers,
                container_id: action.container_id
            };

        }
        case CLEAR_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE:
            return initState;
        case SHOW_LOADING_ICON_OFFERS_IN_CONSIDERATION:
            return { ...state,
                showLoadingIcon: action.payload
            };
        default:
            return state;
    }
};
