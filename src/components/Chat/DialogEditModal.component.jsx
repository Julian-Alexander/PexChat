import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from '@material-ui/core';
import firebase from '../../firebase';

class DialogEditModal extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    message: this.props.message.content,
    channel: this.props.currentChannel,
    user: this.props.user,
    errors: []
  };

  editMessage = () => {
    const { handleClose, messageUpdate } = this.props;
    const { messagesRef, channel } = this.state;
    // console.log('asdads', user.uid);
    // console.log('asdads', this.props.message.user.id);

    if (this.isOwnMessage() && this.state.message) {
      messagesRef
        .child(channel.id)
        .orderByChild('id')
        .equalTo(this.props.message.id)
        .once('value', snapshot => {
          snapshot.forEach(childSnapshot => {
            // var childKey = childSnapshot.key;
            // let childData = childSnapshot.val();
            childSnapshot.ref.update({
              content: this.state.message,
              edited: '(Edited)',
              deleted: ''
            });
            // console.log('testestete', childKey, childData);
          });
        })
        .then(() => {
          this.setState({ message: '', errors: [] });
          messageUpdate();
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err)
          });
        });
      handleClose();
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      });
    }
  };

  isOwnMessage = () => this.props.message.user.id === this.props.user.uid;
  deleteMessage = () => {
    const { handleClose, messageUpdate } = this.props;
    const { messagesRef, channel } = this.state;

    if (this.isOwnMessage()) {
      messagesRef
        .child(channel.id)
        .orderByChild('id')
        .equalTo(this.props.message.id)
        .once('value', snapshot => {
          snapshot.forEach(childSnapshot => {
            // var childKey = childSnapshot.key;
            // let childData = childSnapshot.val();
            childSnapshot.ref.update({
              content: '',
              edited: '',
              deleted: '(Message was deleted)'
            });
            // console.log('testestete', childKey, childData);
          });
        })
        .then(() => {
          this.setState({ message: '', errors: [] });
          messageUpdate();
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err)
          });
        });
      handleClose();
    } else {
      this.setState({
        errors: this.state.errors.concat({
          message: 'Could not delete message'
        })
      });
      handleClose();
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFocus = event => event.target.select();

  render() {
    const { dialog, handleClose } = this.props;

    return (
      <Dialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Edit message</DialogTitle>
        <DialogContent>
          <DialogContentText>Modify message to edit</DialogContentText>
          <TextField
            autoFocus
            onFocus={this.handleFocus}
            margin='dense'
            name='message'
            value={this.state.message}
            label='Edit your message here'
            onKeyPress={e =>
              e.key === 'Enter' ? (this.editMessage(), e.preventDefault()) : ''
            }
            onChange={this.handleChange}
            type='text'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button type='submit' onClick={this.editMessage} color='primary'>
            Edit
          </Button>
          <Button type='submit' onClick={this.deleteMessage} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DialogEditModal;
