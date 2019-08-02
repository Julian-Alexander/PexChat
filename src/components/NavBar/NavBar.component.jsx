import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { BubbleChart, TrackChanges, PersonPin } from '@material-ui/icons';
import Channels from '../Channels/Channels.component';
import Chat from '../Chat/Chat.component';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function NavBar() {
  const currentChannel = useSelector(state => state.channel.currentChannel);
  const currentUser = useSelector(state => state.user.currentUser);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [channels, setChannels] = React.useState([]);
  console.log('currentChannel 123', currentChannel);
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
        <Tab icon={<BubbleChart />} label='CHAT' />
        <Tab icon={<PersonPin />} label='MEMBERS' />
      </Tabs>
      {value === 0 && <Channels />}
      {value === 1 && (
        <Chat
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      )}
      {value === 2 && <h1>Page 2</h1>}
    </Paper>
  );
}
