import React from 'react';
import { messages } from '../../../utils/validation';
import { Typography } from '@material-ui/core/Typography';
export default ({ validationRules }) => {
  return (
    <Typography>
      Нужно учитывать:
      {Object.keys(messages).map((key) => {
        if (validationRules[key]) {
          return <Typography variant="p"> {messages[key]} </Typography>;
        }
        return '';
      })}
    </Typography>
  );
};
