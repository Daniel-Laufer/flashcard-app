
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, ThemeProvider, createTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { red } from '@material-ui/core/colors';
import { Alert } from '@material-ui/lab';

// css
import "./LogInPage.css";


import axios from 'axios';








function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Daniel Laufer's Flashcard App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "white"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#ff0000",
    color: "white",
    borderRadius: "20px"
  },
  sign_up_here_link: {
    color: "#ff0000",
  }
}));


const theme = createTheme({
  palette: {
    primary: red,
  },
});

export default function LogInPage() {
  const classes = useStyles();
  const [formData, setFormData] = useState({username: "", password: ""});
  const [errorLoggingIn, setErrorLoggingIn] = useState(false);
  const [successLoggingIn, setSuccessLoggingIn] = useState(false);




  const handleSubmit = (event) => {
    
    event.preventDefault(); // ensure page doesn't reload 

    console.log(formData);
    const payload = {
      username: formData.username,
      password: formData.password
    }   
    
    axios.post("api/login/", payload)
      .then((res) => {
        const token = res.headers["auth-token"];
        localStorage.setItem("auth-token", token);
        setErrorLoggingIn(false);
        setSuccessLoggingIn(true);
      })
      .catch((err) => {
        console.log(err);
        setErrorLoggingIn(true);
        setSuccessLoggingIn(false);
      });
  };


  const handleFormDataChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div id="login-in-pizza-logo">
        </div>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
        <ThemeProvider theme={theme}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              autoComplete="username"
              value={formData.username}
              id="mui-theme-provider-outlined-input"
              onChange={handleFormDataChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              id="mui-theme-provider-outlined-input"
              value={formData.password}
              onChange={handleFormDataChange}
            />
          </ThemeProvider>
          {/* <FormControlLabel
            className={classes.rememberMe}
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            Sign In
          </Button>
          {
            errorLoggingIn || successLoggingIn ? (
              <Alert severity={errorLoggingIn ? "error": "success"}>
                This is an error alert — check it out!
              </Alert>
            ) : null
          }
          <Grid container>
            <Grid item>
            Don't have an Account?
              <Link href="#" variant="body2">
              <span className={classes.sign_up_here_link}>{" Sign up here!"}</span>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
