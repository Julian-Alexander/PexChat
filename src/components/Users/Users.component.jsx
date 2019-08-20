import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { setPrivateChannel } from '../../actions/index.action';
import firebase from '../../firebase';
import { FiberManualRecord } from '@material-ui/icons';
import PrivateChat from '../Chat/PrivateChat.component';

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

const styles = theme => ({
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
});

class Users extends React.Component {
  state = {
    value: 0,
    user: this.props.currentUser,
    privateIntro: true,
    users: [],
    usersRef: firebase.database().ref('users'),
    presenceRef: firebase.database().ref('presence'),
    connectedRef: firebase.database().ref('.info/connected')
  };

  componentDidMount() {
    if (this.state.user && !this.props.privateChannel) {
      this.addListeners(this.state.user.uid);
    } else {
      this.addListeners(this.state.user.uid);
      this.setState({ privateIntro: false });
    }
  }

  addListeners = currentUserUid => {
    let loadedUsers = [];
    this.state.usersRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on('value', snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    this.state.presenceRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on('child_removed', snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  isOnline = user => user.status === 'online';

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      title: user.name,
      name: user.displayName
    };
    this.props.setPrivateChannel(channelData);
    this.setState({ privateIntro: false });
  };

  // initialChannel = user => {
  //   const channelId = this.getChannelId(user.uid);
  //   const channelData = {
  //     id: channelId,
  //     title: user.displayName
  //   };
  //   this.props.setPrivateChannel(channelData);
  // };

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  displayUsersTabs = users =>
    users.length > 0 &&
    users.map((user, index) => (
      <Tab
        label={user.name}
        key={user.uid}
        onClick={() => this.changeChannel(user)}
        icon={
          <FiberManualRecord
            classes={
              this.isOnline(user)
                ? { root: this.props.classes.online }
                : { root: this.props.classes.offline }
            }
          />
        }
        {...a11yProps(index)}
      />
    ));

  displayUsersPanels = users =>
    users.length > 0 &&
    users.map((user, index) => {
      return (
        this.state.value === index && (
          <TabPanel value={this.state.value} key={user.uid} index={index}>
            <PrivateChat
              key={user.uid + 'PV'}
              privateChannel={this.props.privateChannel}
              currentUser={this.state.user}
            />
          </TabPanel>
        )
      );
    });

  render() {
    const { users } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={this.state.value}
          onChange={this.handleChange}
          aria-label='Vertical tabs example'
          className={classes.tabs}
        >
          {this.displayUsersTabs(users)}
        </Tabs>
        {this.state.privateIntro === true ? (
          <strong>Select an User to start a Private Conversation</strong>
        ) : (
          this.displayUsersPanels(users)
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  privateChannel: state.privateChannel.isPrivateChannel
});

export default connect(
  mapStateToProps,
  { setPrivateChannel }
)(withStyles(styles)(Users));
