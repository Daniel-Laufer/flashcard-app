// Full disclosure, I used a free MaterialUI react template as a starting point for this component. 
// These templates can be found here: https://material-ui.com/getting-started/templates/


import React, {useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import { useHistory } from "react-router-dom";

// css
import "./LogInPage.css";


import axios from 'axios';
axios.defaults.baseURL = "https://localhost/"; 

console.log(axios.defaults.transformRequest);






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
    color: "white",
    borderRadius: "20px"
  },
  sign_up_here_link: {
    color: "#303f9f",
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
}));

export default function LogInPage() {
  const classes = useStyles();
  const [formData, setFormData] = useState({username: "", password: ""});
  const [errorLoggingIn, setErrorLoggingIn] = useState(false);
  const [successLoggingIn, setSuccessLoggingIn] = useState(false);
  const history = useHistory();




  const handleSubmit = (event) => {
    
    event.preventDefault(); // ensure page doesn't reload 

    const payload = {
      username: formData.username,
      password: formData.password
    }   
    
    axios.post("api/user/login/", payload)
      .then((res) => {
        const token = res.headers["authorization"].split(" ")[1];
        const user_id = res.data["id"];
        localStorage.setItem("auth-token", token);
        localStorage.setItem("user_id", user_id);
        setErrorLoggingIn(false);
        setSuccessLoggingIn(true);
        setTimeout(() => history.push("/"), 800);
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
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          {
            errorLoggingIn || successLoggingIn ? (
              <Alert severity={errorLoggingIn ? "error": "success"}>
                {errorLoggingIn ? "Error logging in! ": "Success!"}
              </Alert>
            ) : null
          }
          <Grid container>
            <Grid item>
            Don't have an Account?
              <Link onClick={() => history.push("/register")} variant="body2">
              <span className={classes.sign_up_here_link}>{" Sign up here!"}</span>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
