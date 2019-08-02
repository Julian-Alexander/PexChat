import React from 'react';
import mime from 'mime-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from '@material-ui/core';

class DialogModal extends React.Component {
  state = {
    file: null,
    authorized: ['image/jpeg', 'image/jpg', 'image/png']
  };

  addFile = event => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
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
    const { dialog, handleClose } = this.props;

    return (
      <Dialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Upload File</DialogTitle>
        <DialogContent>
          <DialogContentText>Select an Image File</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='file'
            label='Upload File types: jpeg, jpg, png'
            onChange={this.addFile}
            type='file'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button type='submit' onClick={this.prepareFile} color='primary'>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DialogModal;
