import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";
import {Button, Grid} from '@material-ui/core';
import * as styles from './style.css';

export default class OrderProfileFilter extends React.Component<any, {}> {
    constructor(public props: any) {
        super(props);
    }

    render() {
        return (
          <ErrorBoundary>
            <Grid container spacing={8}>
              <Grid item>
                <Button variant="contained" color="primary" className={styles.button}
                        onClick={() => this.props.updateFilter('all')}>
                  Все
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" className={styles.button}
                        onClick={() => this.props.updateFilter('backloading')}>
                  Покажи обратки
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" className={styles.button}
                        onClick={() => this.props.updateFilter('inprogress')}>
                  Частино закрытые
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" className={styles.button}
                        onClick={() => this.props.updateFilter('expired')}>
                  Просроченные
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" className={styles.button}
                        onClick={() => this.props.updateFilter('hot')}>
                  Горящие
                </Button>
              </Grid>
            </Grid>
          </ErrorBoundary>
        );
    }
}