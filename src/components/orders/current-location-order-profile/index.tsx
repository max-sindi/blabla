import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";
import Modal from "@material-ui/core/Modal";
import Button from '@material-ui/core/Button';

import PointMap from '../../UI/point-map/index';
import * as styles from './style.css';
import Grid from '@material-ui/core/Grid/Grid';


class CurrentLocationOrderProfile extends React.Component<any, {}> {

    public render() {
        return (
            <ErrorBoundary>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <div className={styles.custom_modal}>
                        <Grid item>
                            <Grid container justify={'center'} alignItems={'center'}>
                                <Button onClick={this.props.onClose}>
                                    Закрыть текущее местоположение
                                </Button>
                            </Grid>
                        </Grid>
                        <PointMap location={this.props.location}/>
                    </div>
                </Modal>
            </ErrorBoundary>
        );
    }
}

export default CurrentLocationOrderProfile;