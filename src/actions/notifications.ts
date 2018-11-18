import axios from 'axios';
import getUrl from './url';

export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';

export interface INotification {
    id: string;
    date: string;
    name: string;
    data: any;
}

const mockData: INotification[] = [
    {
        id: '1',
        date: '2018-10-06 09:00',
        name: 'customer_make_offer',
        data: {
            order: {},
            user:
                {
                    first_name: 'Иван',
                    last_name: 'Иванов'
                },

            offer: {}
        },
    },
    {
        id: '2',
        date: '2018-10-06 09:00',
        name: 'customer_accept_offer',
        data: {
            order: {},
            user: {
                first_name: 'Иван',
                last_name: 'Иванов'
            },
            offer: {}
        },
    },
    {
        id: '3',
        date: '2018-10-06 09:00',
        name: 'carrier_accept_offer',
        data: {
            order: {},
            user: {
                first_name: 'Иван',
                last_name: 'Иванов'
            },
            offer: {}
        },
    },
    {
        id: '4',
        date: '2018-10-06 09:00',
        name: 'carrier_accept_offer',
        data: {
            order: {},
            user: {
                first_name: 'Иван',
                last_name: 'Иванов'
            },
            offer: {}
        },
    },
];

export const setNotificationsAction = (notifications: INotification[]) => {
    return {
        type: SET_NOTIFICATIONS,
        payload: notifications,
    };
};

export const getNotificationsAction = () => {
    return (dispatch: any, getState: any) => {
        dispatch(setNotificationsAction(mockData));
        // return axios.get(getUrl() + '/notifications/')
        //             .then((response) => {
        //                 if (response.data) {
        //                   dispatch(setNotificationsAction(response.data.results));
        //                 }
        //               })
        //               .catch((reason) => {
        //                 console.log(reason.response);
        //               });
    };
};