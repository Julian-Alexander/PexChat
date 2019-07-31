import React from 'react';
import { Grid } from '@material-ui/core';
import Header from "./components/Header/Header.component";
import NavBar from "./components/NavBar/NavBar.component";
import './App.scss';

function App() {
  return (
    <Grid>
      <Header />
      <NavBar />
    </Grid>
  );
}

export default App;
