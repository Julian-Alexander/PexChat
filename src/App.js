import React from 'react';
import { Grid } from '@material-ui/core';
import Header from "./components/Header/Header.component";
import NavBar from "./components/NavBar/NavBar.component";
import { connect } from "react-redux";

import './App.scss';

const App = (currentUser, currentChannel)  => {
  console.log("loedssg",currentChannel);
  return (
    <Grid>
      <Header />
      <NavBar  currentChannel={currentChannel}/>
    </Grid>
  );
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
});

export default connect(mapStateToProps)(App);