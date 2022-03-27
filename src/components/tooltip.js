import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  tooltip: {
    color: '#fff',
    fontSize: '0.75rem',
    lineHeight: '1.2rem',
    textAlign: 'center',
    background: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '3px',
  },
  arrow: {
    color: 'rgba(0, 0, 0, 0.8)'
  }
}));

const CommonTooltip = ({children, ...props}) => {
  const classes = useStyles();

  return <Tooltip classes={classes} {...props}><span>{children}</span></Tooltip>;
};

export default CommonTooltip;