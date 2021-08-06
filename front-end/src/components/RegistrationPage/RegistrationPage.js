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


import axios from 'axios';





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
  sign_in_here_link: {
    color: "#303f9f",
  }
}));


export default function RegistrationPage() {
  const classes = useStyles();
  const [formData, setFormData] = useState({username: "", password: "", confirmPassword: ""});
  const [errorRegistering, setErrorRegistering] = useState(false);
  const [successRegistering, setSuccessRegistering] = useState(false);
  const history = useHistory();




  const handleSubmit = (event) => {
    
    event.preventDefault(); // ensure page doesn't reload 

    if(formData.password !== formData.confirmPassword){
      return setErrorRegistering(false);
    }
    const payload = {
      username: formData.username,
      password: formData.password
    }   
    
    axios.post("api/user/register/", payload)
      .then((res) => {
        const token = res.headers["authorization"].split(" ")[1];
        const user_id = res.data["id"];
        localStorage.setItem("auth-token", token);
        localStorage.setItem("user_id", user_id);
        setErrorRegistering(false);
        setSuccessRegistering(true);
        setTimeout(() => history.push("/"), 800);
      })
      .catch((err) => {
        console.log(err);
        setErrorRegistering(true);
        setSuccessRegistering(false);
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="confirm-password"
            id="mui-theme-provider-outlined-input"
            value={formData.confirmPassword}
            onChange={handleFormDataChange}
          />
          <Button
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
            className={classes.submit}
          >
            Sign Up
          </Button>
          {
            errorRegistering || successRegistering ? (
              <Alert severity={errorRegistering ? "error": "success"}>
                {errorRegistering ? "Error! ": "Success!"}
              </Alert>
            ) : null
          }
          <Grid container>
            <Grid item>
            Already have an Account?
              <Link onClick={() => history.push("/login")} variant="body2">
              <span className={classes.sign_in_here_link}>{" Sign in here!"}</span>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
