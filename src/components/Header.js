import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    'background-color': 'red',
  },
  avatar: {
    'margin-right': 24,
  },
  title: {
    flexGrow: 1,
  },
});

const Header = () => {
  const classes = useStyles();
  const fakePhoto = 'https://material-ui.com/static/images/avatar/1.jpg';

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Avatar alt="Remy Sharp" src={fakePhoto} className={classes.avatar} />

          <Typography variant="h6" color="inherit" className={classes.title}>
            Inicio
          </Typography>

          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
