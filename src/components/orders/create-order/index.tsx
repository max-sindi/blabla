import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";
import Button from '../../UI/form/formElements/Button';
import {connect} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import * as styles from './style.css';
import ContainerForm from '../container-form';
import ContainersList from '../containers-list';
import { sendOrderRequest, editOrder, deleteOrder } from '../../../actions/orders';
import Locations from '../locations';
import {concatContainers, updateContainer} from './utils';
import { convertContainerFromServerToState } from '../container-form/formContent';

import TagSearch from "../../UI/tag-select";
import {BasePageComponent} from "../../base/basePageComponent";

interface IState {
  containers: any[];
  containerFormVisible: boolean;
  containerFormStatus: string;
  editContainerFields: any[];
  tags: any[];
  isEditPage: boolean;
  loadingType: string;
  transportationType: string;
}

class CreateOrder extends BasePageComponent<any, IState> {
  pageMeta = {
    title: 'Create Order',
  };

  constructor(props: {}) {
    super(props);
  }

  public state: IState = {
    containers: [],
    containerFormVisible: false,
    containerFormStatus: 'create',
    editContainerFields: [],
    tags: [],
    isEditPage: false,
    loadingType: 'backloading',
    transportationType: 'exportation',
  };

  public componentDidUpdate = (prevProps) => {
    const { data } = this.props;
    if(this.props.isEdit && !prevProps.data.containers && data.containers) {
      this.setState(prev => ({
        containers: convertContainerFromServerToState(data.containers, this.props.containerTypeList, this.props.containerLineList),
        isEditPage: true,
        loadingType: data.loading,
        transportationType: data.type,
        tags: data.tags.map(item => ({ value: item, label: item })),
      }))
    }
  }

  public toggleContainerForm = () => {
    this.setState({
      editContainerFields: [],
      containerFormVisible: !this.state.containerFormVisible
    });
  };

  public saveOrder = () => {
    if(this.props.isEdit) {
      this.props.editOrder({
        orderId: this.props.orderId,
        order: Object.assign({}, this.state, { locations: this.props.locations }),
      });
    } else {
      this.props.saveOrder( Object.assign({}, this.state, { locations: this.props.locations }) );
    }
  };

  public deleteOrder = () => {
      this.props.deleteOrder(this.props.orderId);
  };

  public updateLocations = (locations: any) => {
    this.setState({...this.state, ...locations});
  };

  public addContainers = (containers: any) => {
    this.setState({
      containerFormVisible: false,
      containers: concatContainers(this.state.containers, containers)
    });
  };

  public updateContainer = (container: any) => {
    this.setState({
      containerFormVisible: false,
      containers: updateContainer(this.state.containers, container)
    });
  };

  public canRenderContainers = () => {
    return (
      this.props.containerTypeList &&
      this.props.containerTypeList.length > 0 &&
      (this.props.containerLineList && this.props.containerLineList.length > 0)
    );
  };

  public editContainer = (fields: any) => {
    this.setState({
      editContainerFields: fields.slice(),
      containerFormVisible: true
    });
  };

  public copyContainer = (fields: any, count: number) => {
    const newContainers: any[] = [];
    for (let i = 0; i < count - 1; i++) {
      newContainers.push(fields.slice());
    }
    this.addContainers(newContainers);
  };

  public containerFormRender = () => {
    return this.canRenderContainers() ? (
      <ContainerForm
        open={this.state.containerFormVisible}
        onClose={this.toggleContainerForm}
        addContainers={this.addContainers}
        updateContainer={this.updateContainer}
        containerLineList={this.props.containerLineList}
        containerTypeList={this.props.containerTypeList}
        fields={this.state.editContainerFields}
      />
    ) : null;
  };

  public updateTags = (tags) => {
    this.setState({
      tags: tags
    });
  }

  public updateTypes = value => {
    const stateMergeObj = value;

    if(value.transportationType && value.transportationType === 'importation') {
      stateMergeObj.loadingType = 'directloading';
    }

    this.setState(stateMergeObj);
  }

  public deleteContainer = (index: any) => {
    this.setState( prev => {
      const newState = Object.assign({}, prev);
      newState.containers.splice(index, 1);
      return newState;
    })
  }

  public render() {
    return (
      <ErrorBoundary>
        <Grid>
          <Paper className={styles.conatiner}>
            <CardContent>
              <Grid container={true} spacing={16} direction="column">
                <Grid>
                  <Grid item={true}>
                    <Grid>
                      <Typography variant="headline">Создать Заявку</Typography>
                    </Grid>
                  </Grid>
                  <Locations
                    updateLocations={this.updateLocations}
                    editableData={this.props.data}
                    loadingType={this.state.loadingType}
                    transportationType={this.state.transportationType}
                    updateParentState={value => this.updateTypes(value)}
                    tagParams={{
                      updateTags: this.updateTags,
                      value: this.state.tags,
                    }}
                    tagsComponent={TagSearch}
                  />
                </Grid>
              </Grid>
              <Grid container={true} direction="row">
                <Grid sm={10} item={true}>
                  <div className={styles.tableContainer}>
                    <ContainersList
                      getName={this.props.getEnumLabel}
                      edit={this.editContainer}
                      copy={this.copyContainer}
                      list={this.state.containers}
                      deleteContainer={this.deleteContainer}
                      isEditPage={this.state.isEditPage}
                    />
                  </div>
                </Grid>
                <Grid sm={1} item={true} container={true} direction="row">
                  <Grid className={styles.iconContainerRight}>
                    <IconButton
                      onClick={this.toggleContainerForm}
                      color="primary"
                      aria-label="Add"
                    >
                      <AddIcon/>
                    </IconButton>
                  </Grid>
                  {this.containerFormRender()}
                </Grid>
              </Grid>
              <Grid>
                <Button onClick={this.saveOrder} data-buttontype="green" style={{ minWidth: 230 }}>
                   { this.props.isEdit ? 'Сохранить редактирование' : 'Сохранить Заявку' }
                  </Button>
                  { this.props.isEdit &&
                  <Button onClick={this.deleteOrder}>
                      Удалить Заявку
                  </Button>}
              </Grid>
            </CardContent>
          </Paper>
        </Grid>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    containerTypeList: state.commonEnums.containerTypeList,
    containerLineList: state.commonEnums.containerLineList,
    getEnumLabel: (enumCategory: any, value: any) => {
      return state.commonEnums[enumCategory].find((item: any) => {
        return item.id === value;
      }).name;
    },
    locations: state.locations.allLocations,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    saveOrder: (order: any) => {
      dispatch(sendOrderRequest(order));
    },
    editOrder: (params: any) => {
      dispatch(editOrder(params));
    },
    deleteOrder: (order_id: string) => {
      dispatch(deleteOrder(order_id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);
