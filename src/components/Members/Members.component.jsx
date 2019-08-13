import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography, Box } from '@material-ui/core';

import firebase from '../../firebase';
import { FiberManualRecord } from '@material-ui/icons';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  online: {
    color: '#00ff00'
  },
  offline: {
    color: '#ff0000'
  }
}));

const Members = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [membersRef] = React.useState(firebase.database().ref('users'));
  const [connectedRef] = React.useState(
    firebase.database().ref('.info/connected')
  );
  const [presenceRef] = React.useState(firebase.database().ref('presence'));
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    let loadedMembers = [];
    membersRef.on('child_added', snap => {
      if (props.currentUser.uid !== snap.key) {
        let member = snap.val();
        member['uid'] = snap.key;
        member['status'] = 'offline';

        loadedMembers.push(member);
      }
    });
    setTimeout(() => {
      setMembers(loadedMembers);
    }, 500);

    console.log('testestest', loadedMembers);

    connectedRef.on('value', snap => {
      if (snap.val() === true) {
        const ref = presenceRef.child(props.currentUser.uid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    presenceRef.on('child_added', snap => {
      if (props.currentUser.uid !== snap.key) {
        addMemberStatus(snap.key);
      }
    });

    presenceRef.on('child_removed', snap => {
      if (props.currentUser.uid !== snap.key) {
        addMemberStatus(snap.key, false);
      }
    });
  }, [membersRef]);

  const addMemberStatus = (memberId, connected = true) => {
    const updatedMembers = members.reduce((acc, member) => {
      if (member.uid === memberId) {
        member['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(member);
    }, []);
    setMembers(updatedMembers);
  };

  const isMemberOnline = member => member.status === 'online';

  console.log('test', members);

  const displayMembersTabs = members =>
    members.length > 0 &&
    members.map((member, index) => (
      <Tab
        label={member.name}
        key={member.uid}
        icon={
          <FiberManualRecord
            className={
              isMemberOnline(member) ? classes.online : classes.offline
            }
          />
        }
        {...a11yProps(index)}
      />
    ));

  const displayMembersPanels = members =>
    members.length > 0 &&
    members.map((member, index) => (
      <TabPanel value={value} key={member.uid} index={index}>
        {member.name} {member.uid}
      </TabPanel>
    ));

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs example'
        className={classes.tabs}
      >
        {displayMembersTabs(members)}
      </Tabs>
      {displayMembersPanels(members)}
    </div>
  );
};

export default Members;
