import * as React from 'react';
import CreateOrder from '../create-order';
import { getProfile, resetOrderPage } from '../../../actions/orders';
import { connect } from 'react-redux';

class EditOrder extends React.Component<any, {}> {

  componentDidMount = () => {
    this.props.getOrder(this.props.match.params.id);
  }

  componentWillUnmount = () => {
    this.props.resetOrderPage();
  }

  render() {
    const createOrderConfig = {
      isEdit: true,
      data: this.props.data,
      orderId: this.props.match.params.id,
    }

    return (
      <CreateOrder {...createOrderConfig} />
    )
  }
}

function mapStateToProps(state: any) {
  return {
    data: state.orders.currentProfile,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    getOrder: (orderId: any) => {
      dispatch(getProfile(orderId));
    },
    resetOrderPage: () => {
      dispatch(resetOrderPage());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrder)
