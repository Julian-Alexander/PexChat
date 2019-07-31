import React from 'react';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import './Progress.styles.scss';

const BlueLinearProgress = withStyles({
  root: {
    height: 22,
    backgroundColor: lighten('#3366ff', 0.5)
  },
  bar: {
    borderRadius: 33,
    backgroundColor: '#3366ff'
  }
})(LinearProgress);

const PurpleLinearProgress = withStyles({
  root: {
    height: 22,
    backgroundColor: lighten('#6600cc', 0.5)
  },
  bar: {
    borderRadius: 33,
    backgroundColor: '#6600cc'
  }
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing(0)
  }
}));

export default function Progress() {
  const classes = useStyles();

  const [completed, setCompleted] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progress = React.useRef(() => {});
  React.useEffect(() => {
    progress.current = () => {
      if (completed > 100) {
        setCompleted(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setCompleted(completed + diff);
        setBuffer(completed + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    function tick() {
      progress.current();
    }
    const timer = setInterval(tick, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid container alignItems='center' className='landing'>
      <div className={classes.root}>
        <BlueLinearProgress
          className={classes.margin}
          variant='indeterminate'
        />
        <LinearProgress
          variant='buffer'
          value={completed}
          valueBuffer={buffer}
        />
        <div className='loading-chat'>Joining Chat Session...</div>
        <LinearProgress
          color='secondary'
          variant='buffer'
          value={completed}
          valueBuffer={buffer}
        />
        <PurpleLinearProgress className={classes.margin} variant='query' />
      </div>
    </Grid>
  );
}
