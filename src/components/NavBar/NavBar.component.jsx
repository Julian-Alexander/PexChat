import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { BubbleChart, TrackChanges, PersonPin } from '@material-ui/icons';
import Channels from '../Channels/Channels.component';
import Chat from '../Chat/Chat.component';
import { useSelector } from 'react-redux';
// import firebase from '../../firebase';

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
  const [channelCount, setChannelCount] = React.useState();
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  const countUniqueChannels = channels => {
    const counter = channels.length;
    setChannelCount(counter);
  };

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
        <Tab icon={<TrackChanges />} label={`CHANNELS [${channelCount}]`} />
        <Tab icon={<BubbleChart />} label='CHAT' />
        <Tab icon={<PersonPin />} label='MEMBERS' />
      </Tabs>
      {value === 0 && <Channels countUniqueChannels={countUniqueChannels} />}
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
