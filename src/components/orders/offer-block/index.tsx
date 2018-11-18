import * as React from 'react';
import {connect} from 'react-redux';
import * as styles from './style.css';
import {AppBar, Tab, Tabs, Typography, Grid, Button} from '@material-ui/core';
import Offers from './Offers';
import {acceptOffer} from '../../../actions/offers-for-order-profile';

function TabContainer(props) {
    return (
        <Typography component="div" style={{padding: 8 * 3}}>
            {props.children}
        </Typography>
    );
}

class OfferBlock extends React.Component<any, {}> {
    constructor(public props: any) {
        super(props);
    }

    public state: any = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({value});
    };


    public render() {
        const {value} = this.state;
        const {newOffers, reviewingOffers, acceptOffer, currentUser} = this.props;

        return (
            <Grid
                className={styles.main}
                container
                // direction="column"
            >
                <Grid
                    container
                    direction="column"
                >
                    <AppBar position="static">
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            fullWidth
                        >
                            <Tab classes={{root: styles.order__tabsItem}}
                                 label={currentUser.type === 'customer' ? 'Новые офферы' : 'Ваши оферы'}/>
                            <Tab classes={{root: styles.order__tabsItem}} label="В рассмотрении"/>
                            {/* <Tab label="Item Three" href="#basic-tabs" /> */}
                        </Tabs>
                    </AppBar>
                    {value === 0 && (
                        <TabContainer>
                            <Offers
                                data={newOffers}
                                offersType="new"
                                acceptOffer={acceptOffer}
                                isLoading={this.props.newOffersIsLoading}
                            />
                        </TabContainer>
                    )}
                    {value === 1 && (
                        <TabContainer>
                            <Offers
                                data={reviewingOffers}
                                offersType="reviewing"
                                isLoading={this.props.reviewingOffersIsLoading}
                                onOpenCurrentLocation={this.props.onOpenCurrentLocation}
                            />
                        </TabContainer>
                    )}
                </Grid>
                {currentUser.type === 'carrier' &&
                (<Grid
                    container
                    justify="center"
                    alignItems="flex-end"
                >
                    <Button variant="contained" fullWidth>
                        Добавить оффер
                    </Button>
                </Grid>
                )}
            </Grid>
        );
    }

}

function mapStateToProps(state: any) {
    return {
        newOffers: state.newOffersForOrderProfile,
        reviewingOffers: state.offersInConsiderationForOrderProfile,
        newOffersIsLoading: state.newOffersForOrderProfile.showLoadingIcon,
        reviewingOffersIsLoading: state.offersInConsiderationForOrderProfile.showLoadingIcon,
        currentUser: state.bootstrap.user
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        // acceptOffer: (order_id: string, container_id: string, id: any) => {
        //     dispatch(acceptOffer(order_id, container_id, id));
        // },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferBlock);
