import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Container,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  own: {
    backgroundColor: '#ccebff'
  },
  others: {
    width: '100%',
    backgroundColor: '#ffe6cc'
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
                {`${message.content} - `}
              </Typography>
              {timeFromNow(message.timestamp)}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
};

export default ChatMessages;
