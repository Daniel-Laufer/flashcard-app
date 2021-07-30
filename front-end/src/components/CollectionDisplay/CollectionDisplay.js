// Full disclosure, I used a free MaterialUI react template as a starting point for this component. 
// These templates can be found here: https://material-ui.com/getting-started/templates/

import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton"
import "./CollectionDisplay.css";
import CollectionCard from '../CollectionCard/CollectionCard';

const sampleCollectionData = require("./sampleCollectionsList.js")


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function CollectionDisplay() {
  const classes = useStyles();
  const history = useHistory();
  const [collections, setCollections]  = useState([sampleCollectionData]);


    useEffect(() => {
        console.log(localStorage.getItem("auth-token"));
        if(!localStorage.getItem("auth-token")) return history.push("/");


      // retrieve all collections from api
      // ...


      // for now I'll just use some sample data
      setCollections(sampleCollectionData);
      





    }, [history]);

  return (
    <React.Fragment>
      <LogOutButton/>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
              Flashcard Collections
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Here are some collections of flashcards that other users have created! Feel free to take a look at any that intrest you!
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => history.push("/createNewCollection")}>
                    Create your own!
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection}/>
            ))}
          </Grid>
        </Container>
    </React.Fragment>
  );
}
