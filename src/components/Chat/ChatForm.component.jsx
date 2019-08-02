import React from 'react';
import {
  Button,
  InputAdornment,
  TextField,
  Container
} from '@material-ui/core';
import uuidv4 from 'uuid/v4';
import DialogModal from './DialogModal.component';
import ProgressBar from './ProgressBar.component';
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
    uploadState: '',
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    loading: false,
    percentUploaded: 0,
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    dialog: false
  };

  componentDidMount() {
    !this.state.channel
      ? this.setState({ loading: true })
      : this.setState({ loading: false });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = this.state.message;
    }
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

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg}`;

    this.setState(
      {
        uploadState: 'uploading...',
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          'state_changed',
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: 'error',
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: 'error',
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: 'done' });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: this.state.errors.concat(err)
        });
      });
  };
  render() {
    const { loading, errors, message, dialog, percentUploaded, uploadState } = this.state;
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
                  <DialogModal
                    dialog={dialog}
                    handleClose={this.handleClose}
                    uploadFile={this.uploadFile}
                  />
                </InputAdornment>
              )
            }}
          />
          <ProgressBar 
          uploadState={uploadState}
          percentUploaded={percentUploaded}
          />
        </Container>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Chat);
