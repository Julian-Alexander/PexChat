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
import { TagFaces } from '@material-ui/icons';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
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
    privateChannel: this.props.privateChannel,
    user: this.props.currentUser,
    errors: [],
    dialog: false,
    emojiPicker: false
  };

  componentDidMount() {
    this.props.privateChat
      ? this.setState({ loading: false })
      : !this.state.channel
      ? this.setState({ loading: true })
      : this.setState({ loading: false });
  }

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileUrl = null) => {
    const key = this.isPrivate().push().key;

    const message = {
      id: key,
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

  isPrivate = () => {
    const { messagesRef, privateMessagesRef } = this.props;

    if (this.props.privateChat) {
      return privateMessagesRef;
    } else {
      return messagesRef;
    }
  };

  isPrivateChannel = () => {
    const { channel } = this.state;
    const { privateChannel } = this.props;
    if (this.props.privateChat) {
      return privateChannel;
    } else {
      return channel;
    }
  };

  sendMessage = () => {
    const { message } = this.state;
    if (message && this.isPrivateChannel()) {
      this.setState({ loading: true });
      this.isPrivate()
        .child(this.isPrivateChannel().id)
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
    } else if (!this.isPrivateChannel()) {
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

  handleEmojiPicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  };

  handleAddEmoji = emoji => {
    const oldMessage = this.state.message;
    const newMessage = this.colonToUnicode(`${oldMessage} ${emoji.colons}`);
    this.setState({ message: newMessage, emojiPicker: false });
  };

  colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, '');
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== 'undefined') {
        let unicode = emoji.native;
        if (typeof unicode !== 'undefined') {
          return unicode;
        }
      }
      x = ':' + x + ':';
      return x;
    });
  };

  getPath = () => {
    if (this.props.privateChat) {
      return `chat/private-${this.state.privateChannel.id}`;
    } else {
      return 'chat/public';
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.isPrivateChannel().id;
    const ref = this.isPrivate();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg}`;

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
    const {
      loading,
      errors,
      message,
      dialog,
      percentUploaded,
      uploadState,
      emojiPicker
    } = this.state;

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
            onKeyPress={e =>
              e.key === 'Enter' ? (this.sendMessage(), e.preventDefault()) : ''
            }
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
                    color='default'
                    onClick={this.handleEmojiPicker}
                  >
                    {emojiPicker && (
                      <Picker
                        set='apple'
                        emoji='point_up'
                        title='Pick Emoji'
                        onSelect={this.handleAddEmoji}
                        style={{
                          position: 'absolute',
                          bottom: '20px',
                          right: '20px'
                        }}
                      />
                    )}
                    <TagFaces />
                  </Button>
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
                    disabled={loading || uploadState === 'uploading...'}
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
