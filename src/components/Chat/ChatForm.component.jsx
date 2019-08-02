import React from 'react';
import {
  Button,
  InputAdornment,
  TextField,
  Container
} from '@material-ui/core';
import DialogModal from '../Assets/DialogModal.component';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../../firebase';

import './Chat.styles.scss';

const styles = {
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ff0000'
      }
    }
  }
};

class Chat extends React.Component {
  state = {
    loading: false,
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    dialog: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      content: this.state.message
    };
    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message && channel) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else if (!channel) {
      this.setState({
        errors: this.state.errors.concat({
          message: 'Choose a Channel and add a message'
        })
      });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      });
    }
  };

  handleClickOpen = () => this.setState({ dialog: true });

  handleClose = () => this.setState({ dialog: false });

  render() {
    const { loading, errors, message, dialog } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Container maxWidth='xl'>
          <TextField
            fullWidth={true}
            classes={
              errors.some(error => error.message.includes('message'))
                ? { root: classes.root }
                : {}
            }
            onChange={this.handleChange}
            label='Message'
            name='message'
            value={message}
            variant='outlined'
            id='custom-css-outlined-input'
            margin='dense'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    type='submit'
                    size='small'
                    variant='contained'
                    color='primary'
                    onClick={this.sendMessage}
                  >
                    Send
                  </Button>
                  <Button
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                    type='submit'
                    size='small'
                    variant='contained'
                    color='secondary'
                    onClick={this.handleClickOpen}
                  >
                    Upload
                  </Button>
                  <DialogModal dialog={dialog} handleClose={this.handleClose} />
                </InputAdornment>
              )
            }}
          />
        </Container>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Chat);
