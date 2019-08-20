import React from 'react';
import mime from 'mime-types';
import AvatarEditor from 'react-avatar-editor';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../../firebase';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Avatar,
  Button
} from '@material-ui/core';

const styles = {
  avatar: {
    margin: '3em',
    width: '5.5em',
    height: '5.5em'
  }
};

class DialogModal extends React.Component {
  state = {
    avatarPreview: '',
    authorized: ['image/jpeg', 'image/jpg', 'image/png'],
    croppedAvatar: '',
    uploadedCroppedAvatar: '',
    blob: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('users'),
    user: this.props.currentUser,
    metadata: {
      contentType: 'image/jpeg'
    }
  };

  addAvatar = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ avatarPreview: reader.result });
      });
    }
  };

  cropAvatar = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedAvatar: imageUrl,
          blob
        });
      });
      console.log('sss', this.state.user, 'ssss', this.state.usersRef);
    }
  };

  savedCroppedAvatar = () => {
    const { storageRef, userRef, blob, metadata } = this.state;

    storageRef
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadURL => {
          this.setState({ uploadedCroppedAvatar: downloadURL }, () =>
            this.changeAvatar()
          );
        });
      });
  };

  changeAvatar = () => {
    const { handleClose } = this.props;

    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedAvatar
      })
      .then(() => {
        console.log('PhotoURL updated');
        handleClose();
      })
      .catch(err => {
        console.error(err);
      });

    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadedCroppedAvatar })
      .then(() => {
        console.log('User avatar updated');
      })
      .catch(err => {
        console.error(err);
      });
  };

  prepareFile = () => {
    const { file } = this.state;
    const { uploadFile, handleClose } = this.props;

    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        handleClose();
        this.clearFile();
      }
    }
  };

  isAuthorized = filename =>
    this.state.authorized.includes(mime.lookup(filename));

  clearFile = () => this.setState({ file: null });

  render() {
    const { dialog, handleClose, classes } = this.props;
    const { avatarPreview, croppedAvatar } = this.state;

    return (
      <Dialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>New Avatar Upload</DialogTitle>
        <DialogContent>
          <DialogContent style={{ display: 'flex' }}>
            {avatarPreview && (
              <AvatarEditor
                ref={node => {
                  this.avatarEditor = node;
                }}
                image={avatarPreview}
                width={120}
                height={120}
                border={50}
                borderRadius={100}
                scale={1.2}
              />
            )}
            {croppedAvatar && (
              <Avatar
                className={classes.avatar}
                width={100}
                height={100}
                src={croppedAvatar}
              />
            )}
          </DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='file'
            label='Upload File types: jpeg, jpg, png'
            onChange={this.addAvatar}
            type='file'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.cropAvatar} color='primary'>
            Preview
          </Button>
          {croppedAvatar && (
            <Button
              type='submit'
              color='primary'
              onClick={this.savedCroppedAvatar}
            >
              Save Avatar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogModal);
