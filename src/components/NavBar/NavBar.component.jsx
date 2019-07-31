import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { BubbleChart, TrackChanges, PersonPin } from '@material-ui/icons';
import Channels from '../Channels/Channels.component';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function IconLabelTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [channels, setChannels] = React.useState([]);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Paper square className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant='fullWidth'
        indicatorColor='secondary'
        textColor='secondary'
        aria-label='icon label tabs example'
      >
      <Tab icon={<TrackChanges />} label={`CHANNELS [${channels.length}]`} />
        <Tab icon={<PersonPin />} label='MEMBERS' />
        <Tab icon={<BubbleChart />} label='CHAT' />
      </Tabs>
      {value === 0 && <Channels />}
      {value === 1 && <h1>Page 1</h1>}
      {value === 2 && <h1>Page 2</h1>}
    </Paper>
  );
}
