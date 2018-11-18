import * as React from 'react';
import ErrorBoundary from '../../UI/ErrorBoundary';
import {connect} from 'react-redux';
import {push} from 'connected-react-router';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RateReview from '@material-ui/icons/RateReview';
import Edit from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {getOrders, deleteOrder} from '../../../actions/orders';
import * as styles from './style.css';
import OrderProfileFilter from '../order-profile-filter';
import OrdersFilter from '../order-filter/index';


type CreateNewOrder = () => void;

interface IPropsOrdersMain {
    orders: any;
    createNewOrder: CreateNewOrder;
    getOrders: (attributes?) => void;
    viewOrder: (id: any) => void;
    containerTypeList: any[];
    containerLineList: any[];
    editOrder: (id: any) => void;
    deleteOrder: (id: any, fromOrdersMain: boolean) => void;
}

class OrdersMain extends React.Component<IPropsOrdersMain> {
    constructor(props: IPropsOrdersMain) {
        super(props);
        // this.createNewOrder = this.createNewOrder.bind(this);
    }

    public componentDidMount() {
        this.props.getOrders();
    }


    public viewProfile = (id: any) => () => {
        this.props.viewOrder(id);
    };

    public editOrder = (id: any) => () => {
        this.props.editOrder(id);
    };

    deleteOrder = (id: any) => {
        this.props.deleteOrder(id, true);
    };

    public updateFilter = (filter) => {
        let filterUrl = {};
        switch (filter) {
            case 'all':
                break;
            case 'backloading':
                filterUrl = {...filterUrl, loading: 'backloading'};
                break;
            case 'inprogress':
                filterUrl = {...filterUrl, state: 'partial_accepted'};
                break;
            case 'expired':
                filterUrl = {...filterUrl, state: 'expired'};
                break;
            case 'hot':
                filterUrl = {...filterUrl, state: 'hot'};
                break;
            default:
                break;
        }
        this.props.getOrders(filterUrl);
    };

    public render() {
        return (
            <ErrorBoundary>
                <Grid>
                    <Paper>
                        <CardContent>
                            <Grid container={true} direction="column">
                                <Grid container={true} direction="row">
                                    <Grid item={true}>
                                        <Typography variant="headline">Заявки</Typography>
                                    </Grid>
                                    <Grid container className={styles.iconContainerRight}>
                                        <Grid item>
                                            <OrderProfileFilter updateFilter={this.updateFilter}></OrderProfileFilter>
                                        </Grid>
                                        <IconButton
                                            onClick={this.props.createNewOrder}
                                            color="primary"
                                            aria-label="Add"
                                        >
                                            <AddIcon/>
                                        </IconButton>
                                    </Grid>
                                    <Grid>
                                        <div>
                                            <OrdersFilter/>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid>
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>Направление</td>
                                            <td>Регион (Область)</td>
                                            <td>Дата загрузки</td>
                                            <td>Место загрузки</td>
                                            <td>Место выгрузки</td>
                                            <td>Линия</td>
                                            <td>Тип контейнера</td>
                                            <td>Вес груза</td>
                                            <td>Тип платформы</td>
                                            <td>Тип груза</td>
                                            <td>ADR</td>
                                            <td>Цена</td>
                                            <td>Теги</td>
                                            <td></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.orders && this.props.orders.map(order => {
                                            return this.renderProfileRow(order);
                                        })}
                                        </tbody>
                                    </table>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Paper>
                </Grid>
            </ErrorBoundary>
        );
    }

    private findLoadingDate(locations) {
        const location = locations.find(location => location.type === 'loading');
        if (location) {
            return location.date;
        }
        return '';
    }

    private findLocationRegion(locations, type) {
        const location = locations.find(location => location.type === type);
        if (location) {
            return location.region;
        }
        return '';
    }

    private getType(type) {
        return {'importation': 'Импорт', 'exportation': 'Экспорт'}[type];
    }

    public renderProfileRow(profile) {
        if (profile && profile.containers && profile.containers.length > 0) {
            profile.type = this.getType(profile.type);
            profile.loading_date = this.findLoadingDate(profile.locations);
            profile.loading_place = this.findLocationRegion(profile.locations, 'loading');
            profile.unloading_place = this.findLocationRegion(profile.locations, 'unloading');
            return (
                <React.Fragment key={profile.id}>
                    <tr>
                        <td rowSpan={profile.containers.length}>
                            {profile.public_id}
                        </td>
                        <td rowSpan={profile.containers.length}>
                            {profile.type}
                        </td>
                        <td rowSpan={profile.containers.length}>
                            {profile.region}
                        </td>
                        <td rowSpan={profile.containers.length}>
                            {profile.loading_date}
                        </td>
                        <td rowSpan={profile.containers.length}>
                            {profile.loading_place}
                        </td>
                        <td rowSpan={profile.containers.length}>
                            {profile.unloading_place}
                        </td>
                        <td rowSpan={profile.containers.length}>
                            {this.renderContainerLine(profile.containers[0].line)}
                        </td>
                        <td>
                            {this.renderContainerType(profile.containers[0].type)}
                        </td>
                        <td>
                            {profile.containers[0].cargo_weight}
                        </td>
                        <td>
                            {profile.containers[0].trailer_type}
                        </td>
                        <td>
                            {profile.containers[0].cargo_description}
                        </td>
                        <td>
                            {profile.containers[0].un_number}
                        </td>
                        <td>
                            {profile.containers[0].price}
                        </td>

                        <td rowSpan={profile.containers.length}>
                            {profile.tags.map(tag => `${tag} `)}
                        </td>
                        <td rowSpan={profile.containers.length}>
                            <IconButton
                                onClick={this.viewProfile(profile.id)}
                                color="primary"
                                aria-label="View"
                            >
                                <RateReview/>
                            </IconButton>
                            <IconButton
                                onClick={this.editOrder(profile.id)}
                                color="primary"
                                aria-label="View"
                            >

                                <Edit/>
                            </IconButton>
                            <IconButton
                                onClick={() => this.deleteOrder(profile.id)}
                                color="primary"
                                aria-label="View"
                            >

                                <DeleteForeverIcon/>
                            </IconButton>
                        </td>
                    </tr>
                    {profile.containers.length > 1 ? (
                        profile.containers.slice(1).map(container => {
                                return (
                                    <tr key={container.id}>
                                        <td>
                                            {this.renderContainerType(container.type)}
                                        </td>
                                        <td>
                                            {container.cargo_weight}
                                        </td>
                                        <td>
                                            {container.trailer_type}
                                        </td>
                                        <td>
                                            {container.cargo_description}
                                        </td>
                                        <td>
                                            {container.un_number}
                                        </td>
                                        <td>
                                            {container.price}
                                        </td>
                                    </tr>
                                );
                            }
                        )
                    ) : null}
                </React.Fragment>
            );
        }
    }

    renderContainerType(typeId) {
        if (this.props.containerTypeList) {
            const type = this.props.containerTypeList.filter(containerType => containerType.id === typeId)[0].name;
            return type;
        }
    }

    renderContainerLine(typeId) {
        if (this.props.containerLineList) {
            const line = this.props.containerLineList.filter(containerLine => containerLine.id === typeId)[0].name;
            return line;
        }
    }

    public handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
}

function mapStateToProps(state: any) {
    return {
        orders: state.orders.list,
        containerTypeList: state.commonEnums.containerTypeList,
        containerLineList: state.commonEnums.containerLineList
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        viewOrder: (id: any) => {
            dispatch(push('/app/orders/profile/' + id));
        },
        createNewOrder: () => {
            dispatch(push('/app/orders/create'));
        },
        getOrders: (attributes) => {
            dispatch(getOrders(attributes));
        },
        editOrder: (id: any) => {
            dispatch(push('/app/orders/edit/' + id));
        },
        deleteOrder: (order_id: string, flag: any) => {
            dispatch(deleteOrder(order_id, flag));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersMain);
