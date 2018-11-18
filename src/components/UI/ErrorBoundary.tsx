import * as Sentry from '@sentry/browser';
import * as React from 'react';

interface IErrorBoundaryState {
  error?: any;
};

export default class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    const prod = process.env.SENTRY_DSN;
    console.log('GGG', prod);
    if(prod) {
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.captureException(error);
      });

    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className='error-box'>
          Oops... Crashed.
        </div>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}