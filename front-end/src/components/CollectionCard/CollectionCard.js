// Full disclosure, I used a free MaterialUI react template as a starting point for this component. 
// These templates can be found here: https://material-ui.com/getting-started/templates/


import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import "./CollectionCard.css"
import StarRating from '../StarRating/StarRating';
import { useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

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
    textAlign: "left"
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  }
}));

export default function CollectionCard({collection}) {
  const classes = useStyles();
  const history = useHistory();


  return (
    <Grid item key={collection.id} xs={12} sm={6} md={4}>
        <Card className={classes.card}>

          <CardContent className={classes.cardContent}>
            <Typography className="cardTitle" gutterBottom variant="h6" component="h4">
              {collection.title}
            </Typography>
            <Divider variant="left" style={{"margin-bottom":"10px"}}/>
            <Typography>
              Created by: <strong>{collection.username}</strong><br/>
              Rating: 
              <StarRating collection={collection} is_input={false}/><br/>
              Description: {collection.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => history.push(`/collection/${collection.id}`)} size="small" color="primary">
              View
            </Button>
            {
              localStorage.getItem("user_id") && collection.user_id && localStorage.getItem("user_id") === collection.user_id.toString() ? 
              <Button onClick={() => history.push(`/collection/edit/${collection.id}`)} size="small" color="primary">
                Edit
              </Button>
              :
              null
            }
          </CardActions>
        </Card>
      </Grid>
  );
}