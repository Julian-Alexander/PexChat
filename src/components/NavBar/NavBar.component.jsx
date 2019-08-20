import React from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BubbleChart, TrackChanges, PersonPin } from '@material-ui/icons';
import Channels from '../Channels/Channels.component';
import Users from '../Users/Users.component';
import Chat from '../Chat/Chat.component';
import { useSelector } from 'react-redux';

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
  const [show, setShow] = React.useState('none');
  const [channelCount, setChannelCount] = React.useState();

  function handleChange(event, newValue) {
    setValue(newValue);
    showComp(newValue);
  }

  const showComp = newValue => {
    newValue !== 2 ? setShow('none') : setShow('block');
  };

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
        <Tab
          value={0}
          icon={<TrackChanges />}
          label={`CHANNELS [${channelCount}]`}
        />
        <Tab value={1} icon={<BubbleChart />} label='CHAT' />
        <Tab value={2} icon={<PersonPin />} label='USERS' />
      </Tabs>
      {value === 0 && (
        <Channels
          countUniqueChannels={countUniqueChannels}
          handleChange={handleChange}
        />
      )}
      {value === 1 && (
        <Chat
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      )}
      {
        <div style={{ display: `${show}` }}>
          <Users currentUser={currentUser} />
        </div>
      }
    </Paper>
  );
}
