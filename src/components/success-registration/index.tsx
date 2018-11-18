import * as React from 'react';
import FocusContainer from '../UI/focus-container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';


export default () => {
  return (
    <FocusContainer>
      <Card>
        <CardContent>
          <Typography variant="headline" component="h2">
            Успешная Регистрация
          </Typography>
          <Typography variant="body1">Регистрация прошла упешно</Typography>
          <Link to='/login'> Войти в систему </Link>
        </CardContent>
      </Card>
    </FocusContainer>
  );
};
