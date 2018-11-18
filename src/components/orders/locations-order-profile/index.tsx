import * as React from 'react';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';



const locationTypes = [
    {
        sysname: 'loading',
        label: 'Загрузка',
    },
    {
        sysname: 'unloading',
        label: 'Выгрузка',
    },
    {
        sysname: 'fumigation',
        label: 'Фумигация',
    },
    {
        sysname: 'customs',
        label: 'Таможня',
    },
    {
        sysname: 'stuffing',
        label: 'Стаффинг',
    },
    {
        sysname: 'inspection',
        label: 'Инспекция',
    },
];

const checkExistField = (field) => {
    return field ? field : '';
};

const renderTruckStatus = (state) => {
    switch (state) {
        case 'new':
            return 'Запланирован к перевозке';
        case 'ontheway':
            return 'В пути';
        case 'atplace':
            return 'На месте';
        case 'done':
            return 'Проехал';
    }
};

class LocationsOrderProfile extends React.Component<any, {}> {
    state = {
        open: false,
    };

    uniqueIdCarrier = () => {
        const onlyUnique = (value, index, self) => {
            return self.indexOf(value) === index;
        };

        const ids = this.props.trucksForCurrentProfile.map(item => item.carrier.id);
        return ids.filter(onlyUnique);
    };

    trucksForLocation = (locationId) => {
        return this.props.trucksForCurrentProfile.filter(item => item.location === locationId);
    };

    trucksForCarrierInLocation = (carrierId, trucksInLocation) => {
        return trucksInLocation.filter(item => item.carrier.id === carrierId);
    };


    renderContainerType(typeId) {
        if (this.props.containerTypeList) {
            return this.props.containerTypeList.filter(containerType => containerType.id === typeId)[0].name;
        }
    }

    public render() {

        return (
            <Grid container spacing={16}>
                <Grid item xs={4}>
                    <h3>Локации:</h3>
                </Grid>
                <Grid item xs={8}>
                    <h3>Машины:</h3>
                </Grid>
                {this.props.currentProfile && this.props.currentProfile.locations.map(location => {
                    return (
                        <Grid container key={location.id}>
                            <Grid container key={location.id}>
                                <Grid container xs={4} direction='column'>
                                    <h4>{locationTypes.find(item => item.sysname === location.type).label}</h4>
                                    <Typography>
                                        {`Дата: ${checkExistField(location.date)}`}
                                    </Typography>
                                    <Typography>
                                        {`Расположение: ${location.country}, ${location.region}, ${location.city}, ${location.address}`}
                                    </Typography>
                                    <Typography>
                                        {`Контактное лицо: ${location.contact_info ? checkExistField(location.contact_info.name) : ''}`}
                                    </Typography>
                                    <Typography>
                                        {`Телефон: ${location.contact_info ? checkExistField(location.contact_info.phone_number) : ''}`}
                                    </Typography>
                                </Grid>
                                <Grid container xs={8} direction='column'>
                                    {this.uniqueIdCarrier().map(carrierId => {
                                        return (
                                            <Grid container direction='column' key={carrierId}>
                                                {this.trucksForCarrierInLocation(carrierId, this.trucksForLocation(location.id)).length !== 0 &&
                                                <Grid item xs={12}>
                                                    <Grid container justify={'flex-start'} alignItems={'center'}>
                                                        <FontAwesomeIcon size="2x" icon='truck'/>
                                                        <Typography>
                                                            Перевозчик: {this.props.trucksForCurrentProfile.find(item => item.carrier.id === carrierId).carrier.name}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>}
                                                {this.trucksForCarrierInLocation(carrierId, this.trucksForLocation(location.id)).length !== 0 &&
                                                this.trucksForCarrierInLocation(carrierId, this.trucksForLocation(location.id)).map(item => {
                                                    return (
                                                        <Grid container key={item.container} direction='column'>
                                                            <Grid container spacing={24}>

                                                                <Grid item>
                                                                    <Grid container justify={'flex-start'} alignItems={'center'}>
                                                                        <Typography>1x</Typography>
                                                                        <FontAwesomeIcon icon='truck'/>
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Typography>
                                                                        {`${item.driver.user.first_name} ${item.driver.user.last_name}`}
                                                                    </Typography>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Typography>
                                                                        {item.driver.user.phone_number}
                                                                    </Typography>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Typography>
                                                                        {item.truck.registration_number}
                                                                    </Typography>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Typography>
                                                                        {item.truck.trailer.registration_number}
                                                                    </Typography>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Typography>
                                                                        {renderTruckStatus(item.state)}
                                                                    </Typography>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Typography>
                                                                        {item.date}
                                                                    </Typography>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Grid container justify={'flex-start'} alignItems={'center'}>
                                                                        <Button
                                                                            onClick={() => this.props.onOpenCurrentLocation(location)}
                                                                        >
                                                                            Текущее местоположение
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container spacing={40}>
                                                                <Grid item>
                                                                    <Grid container justify={'flex-start'} alignItems={'center'}>
                                                                        <Typography>
                                                                            Контейнер: 1x
                                                                        </Typography>
                                                                        <Typography>
                                                                            {this.renderContainerType(this.props.currentProfile.containers.find(container => container.id === item.container).type)}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Grid container justify={'flex-start'} alignItems={'center'}>
                                                                        <FontAwesomeIcon icon='boxes'/>
                                                                        <Typography>
                                                                            {this.props.currentProfile.containers.find(container => container.id === item.container).cargo_description}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid item>
                                                                    <Grid container justify={'flex-start'} alignItems={'center'}>
                                                                        <FontAwesomeIcon icon='dollar-sign'/>
                                                                        <Typography>
                                                                            {this.props.currentProfile.containers.find(container => container.id === item.container).price}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>

                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Divider/>
                                                            </Grid>
                                                        </Grid>
                                                    );
                                                })
                                                }
                                            </Grid>
                                        );
                                    })
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        currentProfile: state.orders.currentProfile,
        trucksForCurrentProfile: state.orders.trucksForCurrentProfile,
        containerTypeList: state.commonEnums.containerTypeList,
    };
}

export default connect(mapStateToProps)(LocationsOrderProfile);
