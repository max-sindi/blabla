import * as React from 'react';
import { Route, Redirect } from 'react-router';
import Login from '../login';
import { connect } from 'react-redux';

const LoginRoute =  ({ isLoggedIn, ...rest }: {isLoggedIn: boolean})=>{
    const render = (props:any)=>(isLoggedIn ? <Redirect to={{
        pathname: props.from ? props.from : '/',
      }} /> :  <Login {...props}  />);

    return(<Route {...rest}  render={render}/>);
};

function mapStateToProps(state: any) {
    return { isLoggedIn: state.auth.token &&  state.auth.token.length > 0 };
  }
  

export default connect(mapStateToProps)(LoginRoute)


