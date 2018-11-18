import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";
import {connect} from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import {getOrders, getRegionsForOrders} from '../../../actions/orders';
import TableFilter, {ITableFilter} from "../../UI/table-filter/index";


interface IOrdersFilterProps {
    containerTypeList: any[],
    containerLineList: any[],
    orders: any[];
    regions: any[];
    getOrders: (attributes:string) => void;
    getRegionsForOrders: (attributes:string) => void;
}


interface IOfferFilterState {
    filters: any[];
}

const orderFilters : ITableFilter[] = [
    {
        sysname: 'id',
        label: 'ID',
        type: 'text',
        apiOptionName: 'public_id',
        width: 'md',
        inline: true,
    },
    {
        sysname: 'type',
        label: 'Направление',
        type: 'select',
        apiOptionName: 'type',
        valueList : [],
        margin: 'normal',
        width: 'md',
        inline: true,
    },
    {
        sysname: 'region',
        label: 'Регион',
        type: 'searchable-input',
        apiOptionName: 'region',
        valueList : [],
        width: 'md',
        inline: true,
    },
    {
        sysname: 'container',
        label: 'Контейнер',
        type: 'select',
        apiOptionName: 'containers__type__name',
        valueList : [],
        margin: 'normal',
        width: 'md',
        inline: true,
    },
    {
        sysname: 'container_line',
        label: 'Линия',
        type: 'select',
        apiOptionName: 'containers__line__name',
        valueList : [],
        margin: 'normal',
        width: 'md',
        inline: true,
    },
    {
        sysname: 'date_from',
        label: 'Дата загрузки с',
        type: 'date',
        apiOptionName: 'loading_date__gte',
        margin: 'normal',
        width: 'sm',
        inline: true,
    },
    {
        sysname: 'date_to',
        label: 'Дата загрузки по',
        type: 'date',
        apiOptionName: 'loading_date__lt',
        margin: 'normal',
        width: 'sm',
        inline: true,
    },
    {
        sysname: 'date_creation_from',
        label: 'Дата создания с',
        type: 'date',
        apiOptionName: 'creation_date',
        margin: 'normal',
        width: 'sm',
        inline: true,
    },
    {
        sysname: 'date_creation_to',
        label: 'Дата создания по',
        type: 'date',
        apiOptionName: 'creation_date',
        margin: 'normal',
        width: 'sm',
        inline: true,
    },
];


class OrdersFilter extends React.Component<IOrdersFilterProps> {
    props: IOrdersFilterProps;
    state: IOfferFilterState = {
        filters : [],
    };

    public render() {
        this.setupSelectLists();

        return (
          <ErrorBoundary>
              <Grid>
                  <Paper>
                      <CardContent>
                          <Grid container={true} direction="column">
                              <Grid container={true} direction="row">
                                {this.renderFilters()}
                              </Grid>
                          </Grid>
                      </CardContent>
                  </Paper>
              </Grid>
          </ErrorBoundary>
        );
    }

    public renderFilters() {
        return (
            <TableFilter filters={orderFilters}
                         onFilter={this.onFilter}
                         autocompleteRequests={{
                           region: {
                             funcForRequest: this.props.getRegionsForOrders,
                             resultStore: this.props.regions
                           },
                         }}
            >

            </TableFilter>
        );
    }

    public onFilter = (data) => {
        this.props.getOrders(data.requestData);
    };

    private setupSelectLists() {

        // fill type select
        const typeField = orderFilters.find((val) => (val.sysname === 'type'));
        typeField.valueList = [
            {
                label: 'Экспорт',
                value: 'exportation'
            },
            {
                label: 'Импорт',
                value: 'importation'
            }
        ];

        // fill containerType select
        if (this.props.containerTypeList) {
            const containerField = orderFilters.find((val) => (val.sysname === 'container') );
            containerField.valueList = this.props.containerTypeList.map(container => {
                return {label: container.name, value: container.name};
            });

        }

        // fill containerLine select
        if (this.props.containerLineList) {
            const lineField = orderFilters.find((val) => (val.sysname === 'container_line') );
            lineField.valueList = this.props.containerLineList.map(line => {
                return {label: line.name, value: line.name};
            });
        }
    }
}

function mapStateToProps(state: any) {
    return {
        containerTypeList: state.commonEnums.containerTypeList,
        containerLineList: state.commonEnums.containerLineList,
        orders: state.orders.list,
        regions: state.orders.regions,
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        getOrders: (attributes = '') => {
            dispatch(getOrders(attributes));
        },
        getRegionsForOrders: (attributes) => {
            dispatch(getRegionsForOrders(attributes));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersFilter);
