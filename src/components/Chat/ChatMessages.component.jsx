import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from '@material-ui/core';
import './Chat.styles.scss';
import DialogEditModal from './DialogEditModal.component';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  own: {
    backgroundColor: '#ccebff',
    borderRadius: 11
  },
  others: {
    width: '100%',
    backgroundColor: '#ffe6cc',
    borderRadius: 11
  },
  inline: {
    display: 'inline'
  }
}));

const timeFromNow = timestamp => moment(timestamp).fromNow();

const ChatMessages = ({
  message,
  privateChat,
  currentChannel,
  privateChannel,
  privateMessagesRef,
  user,
  messageUpdate
}) => {
  const classes = useStyles();
  const [dialog, setDialog] = React.useState(false);

  const handleClickOpen = () => setDialog(true);

  const handleClose = () => setDialog(false);

  const isOwnMessageStyle = (message, user) => {
    return message.user.id === user.uid ? classes.own : classes.others;
  };

  const isOwner = (message, user) => {
    return message.user.id === user.uid ? handleClickOpen() : '';
  };

  const isImage = message => {
    return (
      message.hasOwnProperty('image') && !message.hasOwnProperty('content')
    );
  };

  return (
    <List className={classes.root}>
      <ListItem
        alignItems='flex-start'
        className={isOwnMessageStyle(message, user)}
        onClick={() => isOwner(message, user)}
      >
        <ListItemAvatar>
          <Avatar
            alt='User Avatar'
            className={classes.avatar}
            src={message.user.avatar}
          />
        </ListItemAvatar>
        <ListItemText
          primary={message.user.name}
          secondary={
            <React.Fragment>
              <Typography
                component='span'
                variant='body2'
                className={classes.inline}
                color='textPrimary'
              >
                {isImage(message) ? (
                  <img
                    src={message.image}
                    alt='User Avatar'
                    className='image-message'
                  />
                ) : (
                  `${message.content}` +
                  ' ' +
                  `${message.edited ? message.edited : ''}` +
                  ' ' +
                  `${message.deleted ? message.deleted : ''}`
                )}
              </Typography>
              <br />
              {timeFromNow(message.timestamp)}
            </React.Fragment>
          }
        />
      </ListItem>
      <DialogEditModal
        privateChat={privateChat}
        privateMessagesRef={privateMessagesRef}
        messageUpdate={messageUpdate}
        user={user}
        dialog={dialog}
        message={message}
        privateChannel={privateChannel}
        currentChannel={currentChannel}
        handleClose={handleClose}
      />
    </List>
  );
};

export default ChatMessages;
