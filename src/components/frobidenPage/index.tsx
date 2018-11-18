import * as React from 'react';
import FocusContainer from '../UI/focus-container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
export default () => {
  return (
    <FocusContainer>
      <Card>
        <CardContent>
          <Typography variant="headline" component="h2">
            This Page Forbidden For Use
          </Typography>
        </CardContent>
      </Card>
    </FocusContainer>
  );
};
