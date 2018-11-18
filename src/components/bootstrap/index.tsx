import * as React from 'react';
import {connect} from 'react-redux';
import {getBootstrapDataAction} from '../../actions/bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import FocusContainer from '../UI/focus-container';
import {BasePageComponent} from '../base/basePageComponent';

// import purple from '@material-ui/core/colors/purple';

interface IBootstrapProps {
    bootstraped: boolean;
    children: any;
    getBootstrapData: any;
    isLoggedIn: boolean;
}

/**
 * Wrapper coponent for loading data.
 * On mount this component send data bootstrap request.
 *
 * If not logged in    - just render children;
 * If logged in && data not loaded  - render progress icon
 * If logged in && data is loaded   - render children
 */
class BootstrapData extends BasePageComponent<IBootstrapProps, any> {

    constructor(props: IBootstrapProps) {
        super(props);
    }

    public componentDidMount() {
        this.props.getBootstrapData();
    }

    public componentDidUpdate() {
        this.props.getBootstrapData();
    }

    public render() {
        if (!this.props.isLoggedIn) {
            return (this.props.children);
        }
        return this.props.bootstraped ? this.props.children : this.renderAwaitingData();
    }

    private renderAwaitingData() {
        return (
            <FocusContainer>
                <CircularProgress size={100} style={{color: '#fff'}} thickness={4}/>
            </FocusContainer>
        );
    }

};


function mapStateToProps(state: any) {
    return {
        isLoggedIn: !!state.auth.token,
        bootstraped: state.bootstrap.fetched,
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        getBootstrapData: () => {
            dispatch(getBootstrapDataAction());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BootstrapData);
