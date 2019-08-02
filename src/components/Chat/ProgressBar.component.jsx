import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    height: 30
  }
});

function ProgressBar({ uploadState, percentUploaded }) {
  const classes = useStyles();

  const bufferCalc = () => {
    return percentUploaded > 0 ? percentUploaded + 11 : percentUploaded;
  };

  return uploadState === 'uploading...' ? (
    <LinearProgress
      className={classes.root}
      variant='buffer'
      value={percentUploaded}
      valueBuffer={bufferCalc()}
    />
  ) : (
    <LinearProgress
      className={classes.root}
      variant='buffer'
      value={0}
      valueBuffer={0}
    />
  );
}

export default ProgressBar;
