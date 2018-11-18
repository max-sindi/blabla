import * as React from 'react';
import {getProfile, getTrucksForOrderProfile} from '../../../actions/orders';
import ErrorBoundary from "../../UI/ErrorBoundary";
import {connect} from 'react-redux';

import * as styles from './style.css';
import {IContainer, ILocation} from './order.model';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, Typography, TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LocationsOrderProfile from '../locations-order-profile/index';

import {
    getNewOffersForOrderProfile,
    getOffersInConsiderationForOrderProfile,
    clearNewOffersForOrderProfile,
    clearOffersInConsiderationForOrderProfile,
    // acceptOffer
} from '../../../actions/offers-for-order-profile';

import OfferBlock from '../offer-block/index';
import CurrentLocationOrderProfile from '../current-location-order-profile/index';
import logger from '../../../utils/logger';




class OrderProfile extends React.Component<any, {}> {

    public state: any = {
        expanded: null,
        mainRow: false,
        clickedContainerLine: null,
        clickedContainerType: null,
        locationModalVisible : false,
        currentLocationForMap: null
    };

    public componentDidMount() {
        this.props.getProfileData(this.props.match.params.id);
        this.props.getTrucksForOrderProfile(this.props.match.params.id);
    }

    public componentWillUnmount() {
        this.props.clearNewOffersForOrderProfile();
        this.props.clearOffersInConsiderationForOrderProfile();
    }

    public handleChange = (
        panel,
        container_id,
    ) => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });

        if (expanded) {
            this.props.getNewOffersForOrderProfile(
                container_id
            );
            this.props.getOffersInConsiderationForOrderProfile(
                container_id
            );
        } else {
            this.props.clearNewOffersForOrderProfile();
            this.props.clearOffersInConsiderationForOrderProfile();
        }

    };

    public toggleMainRow = () => {
        this.setState({
            mainRow: !this.state.mainRow
        });
    };

    handleCurrentLocationOpen = (location) => {
        this.setState({locationModalVisible: true});
        this.setState({currentLocationForMap: location});
    };

    handleCurrentLocationClose =() => {
        this.setState({locationModalVisible: false});
    };

    public render() {
        return (
            <ErrorBoundary>
                <div className={styles.orderProfile}>

                    <div className={styles.table}>
                        <h3 className={styles.mt10}>Профиль Заявки</h3>
                        <table>
                            <thead>
                            <tr>
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
                                <td>Теги</td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderProfileRow(this.props.currentProfile)}
                            {this.renderProfileSubRow(this.props.currentProfile)}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        {/*<ReactJson src={this.props.currentProfile} theme="monokai"/>*/}
                    </div>

              </div>
              <CurrentLocationOrderProfile
                  open={this.state.locationModalVisible}
                  onClose={this.handleCurrentLocationClose}
                  location={this.state.currentLocationForMap}
              />
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

    public renderProfileRow(profile) {
        if (profile && profile.containers && profile.containers.length > 0) {
            profile.loading_date = this.findLoadingDate(profile.locations);
            profile.loading_place = this.findLocationRegion(profile.locations, 'loading');
            profile.unloading_place = this.findLocationRegion(profile.locations, 'unloading');
            return (
                <React.Fragment>
                    <tr onClick={this.toggleMainRow}>
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
                        <td rowSpan={profile.containers.length}>
                            {profile.tags.map(tag => `${tag} `)}
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
                                    </tr>
                                );
                            }
                        )
                    ) : null}
                </React.Fragment>
            );
        }
    }

    renderProfileSubRow(profile) {
        const {expanded, mainRow} = this.state;
        if (mainRow) {
            return (
                <tr key={profile.id}>
                    <td colSpan={11}>
                        <div className={styles.details}>

                            <div className={styles.containers}>
                                <h3 className={styles.mt10}>Контейнеры к перевозке</h3>
                                {this.props.currentProfile
                                    ? this.props.currentProfile.containers.map((container: IContainer) => {
                                        return (
                                            <ExpansionPanel expanded={expanded === `panel-${container.id}`}
                                                            onChange={this.handleChange(`panel-${container.id}`, container.id)}
                                                            key={container.id}>
                                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                    <Grid container spacing={24}>
                                                        <Grid item xs={4}>
                                                            <Grid container justify={'flex-start'}
                                                                  alignItems={'center'}>
                                                                <FontAwesomeIcon size='2x' icon='truck'
                                                                                 className={styles.mr10}/>
                                                                <Typography>{this.renderContainerType(container.type)}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Grid container justify={'flex-start'}
                                                                  alignItems={'center'}>
                                                                <FontAwesomeIcon size="2x" icon="boxes"
                                                                                 className={styles.mr10}/>
                                                                <Typography>{container.cargo_description}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Grid container justify={'flex-start'}
                                                                  alignItems={'center'}>
                                                                <FontAwesomeIcon size="2x" icon="dollar-sign"
                                                                                 className={styles.mr10}/>
                                                                <Typography>{container.price}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </ExpansionPanelSummary>

                                                <ExpansionPanelDetails>
                                                    <Grid item xs={3}>
                                                        <Grid container justify={'flex-start'} alignItems={'center'}>
                                                            <FontAwesomeIcon size="2x" icon="weight"
                                                                             className={styles.mr10}/>
                                                            <Typography>{container.cargo_weight}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Grid container justify={'flex-start'} alignItems={'center'}>
                                                            <FontAwesomeIcon size="2x" icon="box-open"
                                                                             className={styles.mr10}/>
                                                            <Typography>{this.renderContainerLine(container.line)}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Grid container justify={'flex-start'} alignItems={'center'}>
                                                            <FontAwesomeIcon size="2x" icon="snowflake"
                                                                             className={styles.mr10}/>
                                                            <Typography>{container.genset_temperature}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Grid container justify={'flex-start'} alignItems={'center'}>
                                                            <FontAwesomeIcon size="2x" icon="bomb"
                                                                             className={styles.mr10}/>
                                                            <Typography>{container.un_number}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                        );
                                    })
                                    : []}

                                <TextField
                                    id="standard-name"
                                    label="Доп. условия"
                                    value={this.props.currentProfile.tags.join(', ')}
                                    margin="normal"
                                    fullWidth
                                />

                            </div>

                            <OfferBlock
                                onOpenCurrentLocation = {this.handleCurrentLocationOpen}
                            />
                        </div>

                        <div>
                            <LocationsOrderProfile
                                onOpenCurrentLocation = {this.handleCurrentLocationOpen}
                            />
                        </div>
                    </td>
                </tr>
            );
        } else {

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
}

function mapStateToProps(state: any) {
    return {
        currentProfile: state.orders.currentProfile,
        containerTypeList: state.commonEnums.containerTypeList,
        containerLineList: state.commonEnums.containerLineList
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        getProfileData: (id: any) => {
            dispatch(getProfile(id));
        },
        getTrucksForOrderProfile: (id: any) => {
            dispatch(getTrucksForOrderProfile(id));
        },
        getNewOffersForOrderProfile: (
            container_id: string
        ) => {
            dispatch(getNewOffersForOrderProfile(container_id));
        },
        getOffersInConsiderationForOrderProfile: (
            container_id: string
        ) => {
            dispatch(getOffersInConsiderationForOrderProfile(container_id));
        },
        clearNewOffersForOrderProfile() {
            dispatch(clearNewOffersForOrderProfile());
        },
        clearOffersInConsiderationForOrderProfile() {
            dispatch(clearOffersInConsiderationForOrderProfile());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderProfile);
