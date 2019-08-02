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

class DialogModal extends React.Component{
  render(){
    const { dialog, handleClose} = this.props;
 
  return (
    <div>
      <Dialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Upload File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an Image File
          </DialogContentText>
          <form >
            <TextField
              autoFocus
              margin='dense'
              id='file'
              label='Upload File types: jpg, png'
              value=""
              type='file'
              fullWidth
            />
            
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button type='submit'  color='primary'>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );}
};

export default DialogModal;
