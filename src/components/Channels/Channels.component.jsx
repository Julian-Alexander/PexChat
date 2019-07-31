import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Add } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  avatar: {
    backgroundColor: '#3366ff'
  },
  inline: {
    display: 'inline'
  }
}));

const Channels = props => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [channelTitle, setChannelTitle] = React.useState("");
  const [channelDetails, setChannelDetails] = React.useState("");

  const handleSubmit = event => {
      event.preventDefault();
      console.log("log1");
      if(isFormValid(props)) {
          console.log("channel added");
      }
  }

  const isFormValid = (props) =>
      channelTitle && channelDetails;

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

  return (
    <React.Fragment>
      <List className={classes.root}>
        <ListItem
          alignItems='center'
          button
          selected={selectedIndex === 0}
          onClick={event => OpenAndItemClick(event, 0)}
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
        <ListItem
          alignItems='center'
          button
          selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 1)}
        >
          <ListItemAvatar>
            <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
          </ListItemAvatar>
          <ListItemText
            primary='Brunch this weekend?'
            secondary={
              <React.Fragment>
                <Typography
                  component='span'
                  variant='body2'
                  className={classes.inline}
                  color='textPrimary'
                >
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant='inset' component='li' />
        <ListItem
          alignItems='center'
          button
          selected={selectedIndex === 2}
          onClick={event => handleListItemClick(event, 2)}
        >
          <ListItemAvatar>
            <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
          </ListItemAvatar>
          <ListItemText
            primary='Summer BBQ'
            secondary={
              <React.Fragment>
                <Typography
                  component='span'
                  variant='body2'
                  className={classes.inline}
                  color='textPrimary'
                >
                  to Scott, Alex, Jennifer
                </Typography>
                {" — Wish I could come, but I'm out of town this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant='inset' component='li' />
        <ListItem
          alignItems='center'
          button
          selected={selectedIndex === 3}
          onClick={event => handleListItemClick(event, 3)}
        >
          <ListItemAvatar>
            <Avatar alt='Cindy Baker' src='/static/images/avatar/3.jpg' />
          </ListItemAvatar>
          <ListItemText
            primary='Oui Oui'
            secondary={
              <React.Fragment>
                <Typography
                  component='span'
                  variant='body2'
                  className={classes.inline}
                  color='textPrimary'
                >
                  Sandra Adams
                </Typography>
                {' — Do you have Paris recommendations? Have you ever…'}
              </React.Fragment>
            }
          />
        </ListItem>
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
            autoFocus
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
          <Button type="submit" onClick={handleSubmit} color='primary'>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Channels;
