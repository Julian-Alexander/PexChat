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

const ChatMessages = ({ message, user }) => {
  const classes = useStyles();

  const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? classes.own : classes.others;
  };

  const isImage = message => {
    return (
      message.hasOwnProperty('image') && !message.hasOwnProperty('content')
    );
  };

  return (
    <List className={classes.root}>
      <ListItem alignItems='flex-start' className={isOwnMessage(message, user)}>
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
                  <img src={message.image} alt="User Avatar" className='image-message' />
                ) : (
                  `${message.content}`
                )}
              </Typography>
              <br />
              {timeFromNow(message.timestamp)}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
};

export default ChatMessages;
