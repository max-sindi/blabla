import {SET_NOTIFICATIONS, INotification} from '../actions/notifications';


interface IState {
    list: INotification[],
}

const defaultState: IState = {
    list: [],
};

export default (state: IState = defaultState, action: { type: string, payload: any }) => {
    switch (action.type) {
        case  SET_NOTIFICATIONS:
            return {...state, list: action.payload};
        default:
            return state;
    }
}