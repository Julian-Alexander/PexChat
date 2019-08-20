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
  AccountCircle,
  Lock,
  ErrorRounded,
  Email,
  Visibility,
  VisibilityOff
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import { withStyles } from '@material-ui/core/styles';
import md5 from 'md5';

import './Register.styles.scss';

const styles = {
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red'
      }
    }
  }
};

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    showPassword: false,
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: 'All fields required!' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isUsernameValid(this.state)) {
      error = { message: 'Username needs 4 digits minimum' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Invalid password' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isUsernameValid = ({ username }) => {
    if (username.length < 4) {
      return false;
    } else {
      return true;
    }
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
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
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {});
            })
            .catch(err => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
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

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      showPassword,
      errors,
      loading
    } = this.state;

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
              color='primary'
              style={{ fontSize: 77 }}
              className='register-logo'
            />
            <h2>Register to PexChat</h2>
            <TextField
              id='outlined-username'
              label='Username'
              name='username'
              className={this.handleInputError(errors, 'username')}
              value={username}
              onChange={this.handleChange}
              margin='normal'
              variant='outlined'
              style={{ width: 233 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountCircle />
                  </InputAdornment>
                )
              }}
            />
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
            <TextField
              id='outlined-passwordConfirmation'
              label='Password Confirmation'
              name='passwordConfirmation'
              className={this.handleInputError(errors, 'password')}
              value={passwordConfirmation}
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
              color='primary'
            >
              Submit
            </Button>
            <div className='already-member'>
              Already a Member?{' '}
              <Link to='/login' className='login-link'>
                Login
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

export default withStyles(styles)(Register);
