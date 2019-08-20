import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../actions/index.action';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  avatar: {
    backgroundColor: '#3366ff'
  },
  channelAvatar: {
    backgroundColor: '#e6005c'
  },
  inline: {
    display: 'inline'
  }
}));

const Channels = props => {
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const classes = useStyles();
  const isInitialMount = React.useRef(true);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [channelTitle, setChannelTitle] = React.useState('');
  const [channelDetails, setChannelDetails] = React.useState('');
  const [channels, setChannels] = React.useState([]);
  //   const [firstLoad, setFirstLoad] = React.useState(true);
  //   const [activeChannel, setActiveChannel] = React.useState('');
  const [channelsRef] = React.useState(firebase.database().ref('channels'));

  React.useEffect(
    props => {
      let loadedChannels = [];
      channelsRef.on('child_added', snap => {
        loadedChannels.push(snap.val());
        setChannels(loadedChannels);
      });
      setTimeout(() => {
        counter(loadedChannels);
      }, 500);
    },
    // eslint-disable-next-line
    [props, channelsRef]
  );

  const counter = channels => props.countUniqueChannels(channels);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      channelsRef.off();
    }
  }, [channelsRef]);

  //   const firstChannel = channels => {
  //     const firstChannel = channels[0];
  //     if (firstLoad && channels.length > 0) {
  //       dispatch(setCurrentChannel(firstChannel));
  //     }
  //   };

  //   const updateFirstLoad = () => {
  //     setFirstLoad(false);
  //   };

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid(props)) {
      addChannel();
    }
    counter(channels);
  };

  const addChannel = () => {
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      title: channelTitle,
      details: channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setChannelTitle('');
        setChannelDetails('');
        handleClose();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const isFormValid = props => channelTitle && channelDetails;

  function handleListItemClick(event, index) {
    setSelectedIndex(index);
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function OpenAndItemClick(event, index) {
    handleListItemClick(event, index);
    handleClickOpen();
  }

  const ItemClickAndChangeChannel = (channel, event, index) => {
    handleListItemClick(event, index);
    changeChannel(channel);
    props.handleChange(1, 1);
  };

  //   const setActiveChan = channel => {
  //     setActiveChannel(channel.id);
  //   };

  const changeChannel = channel => {
    // setActiveChan(channel);
    dispatch(setCurrentChannel(channel));
  };

  const displayChannels = channels =>
    channels.length > 0 &&
    channels.map((channel, index) => (
      <ListItem
        alignItems='center'
        button
        key={channel.id}
        selected={selectedIndex === index}
        onClick={event => ItemClickAndChangeChannel(channel, event, index)}
      >
        <ListItemAvatar>
          <Avatar className={classes.channelAvatar}>{index + 1}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={channel.title}
          secondary={
            <React.Fragment>
              <Typography
                component='span'
                variant='body2'
                className={classes.inline}
                color='textPrimary'
              >
                Details -{' '}
              </Typography>
              {channel.details}
            </React.Fragment>
          }
        />
        <Divider variant='inset' component='li' />
      </ListItem>
    ));

  return (
    <React.Fragment>
      <List className={classes.root}>
        <ListItem
          alignItems='center'
          button
          selected={selectedIndex === 99.9}
          onClick={event => OpenAndItemClick(event, 99.9)}
        >
          <ListItemAvatar>
            <Avatar alt='Add Channel' className={classes.avatar}>
              <Add />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary='Create Channel'
            secondary={
              <React.Fragment>
                <Typography
                  component='span'
                  variant='body2'
                  className={classes.inline}
                  color='textPrimary'
                />
                {'Click to create a New Channel'}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant='inset' component='li' />
        {displayChannels(channels)}
      </List>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Create Channel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The title represents the general theme of the channel, like "Food".
            Additionally, give us a short description.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Title'
              value={channelTitle}
              onChange={e => setChannelTitle(e.target.value)}
              type='text'
              fullWidth
            />
            <TextField
              margin='dense'
              id='name'
              label='Description'
              value={channelDetails}
              onChange={e => setChannelDetails(e.target.value)}
              type='text'
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button type='submit' onClick={handleSubmit} color='primary'>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Channels;
