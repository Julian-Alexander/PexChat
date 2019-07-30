import React from 'react';
import {
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  SnackbarContent
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {
  Polymer,
  Lock,
  ErrorRounded,
  Email,
  Visibility,
  VisibilityOff
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red'
      }
    }
  }
};

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    showPassword: false,
    errors: [],
    loading: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? this.props.classes.root
      : '';
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser);
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  isFormValid = ({ email, password }) => email && password;

  render() {
    const { email, password, showPassword, errors, loading } = this.state;

    return (
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'
        className='landing'
      >
        <form onSubmit={this.handleSubmit}>
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
            className='landing'
          >
            <Polymer
              color='secondary'
              style={{ fontSize: 77 }}
              className='register-logo'
            />
            <h2>Login to PexChat</h2>
            <TextField
              id='outlined-email'
              label='Email'
              name='email'
              className={this.handleInputError(errors, 'email')}
              value={email}
              onChange={this.handleChange}
              margin='normal'
              variant='outlined'
              type='email'
              style={{ width: 233 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Email />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              id='outlined-password'
              label='Password'
              name='password'
              className={this.handleInputError(errors, 'password')}
              value={password}
              onChange={this.handleChange}
              margin='normal'
              variant='outlined'
              type={showPassword ? 'text' : 'password'}
              style={{ width: 233 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              disabled={loading}
              className={loading ? 'loading' : ''}
              type='submit'
              size='large'
              variant='contained'
              color='secondary'
            >
              Submit
            </Button>
            <div className='already-member'>
              Want an Account?{' '}
              <Link to='/register' className='login-link'>
                Register
              </Link>
            </div>
            {errors.length > 0 && (
              <SnackbarContent
                style={{ backgroundColor: red[700] }}
                size='small'
                message={
                  <span className='error-message'>
                    <ErrorRounded style={{ fontSize: 44 }} />
                    {this.displayErrors(errors)}
                  </span>
                }
              />
            )}
          </Grid>
        </form>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);
