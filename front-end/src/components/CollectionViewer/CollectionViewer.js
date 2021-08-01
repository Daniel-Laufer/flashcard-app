import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as _ from 'underscore';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Divider from '@material-ui/core/Divider';
import "./CollectionViewer.css";


// axios.defaults.baseURL = "http://localhost";

// import { createTheme, ThemeProvider } from '@material-ui/core/styles';
// import { green } from '@material-ui/core/colors';


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

export default function CollectionViewer() {
    const classes = useStyles();
    const history = useHistory();
    const {id} = useParams();
    const defaultFlashcardData  = [{id: 1, isFlipped: false, front_text: "", back_text: "", createdAt: Date.now()}];
    // const [collectionDetails, setCollectionDetails] = useState({title: "", description: "", public: true});
    const [flashcardData, setFlashcardData] = useState(defaultFlashcardData);


    const flipFlashcard = (flashcard) => {
      const otherFlashcards = flashcardData.filter(item => item.id !== flashcard.id);
      const updatedFlashcard = {...flashcard, isFlipped: !flashcard.isFlipped};

      //sorting to maintain the correct ordering
      setFlashcardData(_.sortBy([...otherFlashcards, updatedFlashcard], "createdAt"));
    };




    useEffect(() => {
      const config = {
        headers: {
            "auth-token": localStorage.getItem("auth-token")
        }
      }
      
      axios.get(`/api/flashcards/${id}`, config)
        .then((res) => {
          console.log("success!");
          setFlashcardData(res.data);
          for(let i=0; i<res.data.length;i++){
            res.data[i] = {...res.data[i], isFlipped:false, createdAt:Date.now()}

          }
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });


      // await axios.get("api/flashcard_collfections/", config)
      // .then((res) => {
      //   console.log("success!");
      //   setCollections(res.data);
      // })
      // .catch((err) => {
      //   console.log(err);
      // });





    }, []);

      return (
          
        <div className="collectionViewerContainer">
          <Fab className="backArrowButton" color="primary" aria-label="add" onClick={() => history.push("/")}>
                <ArrowBackIcon />
            </Fab>

          {/* <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
                {collection.title}
              </Typography>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                {collection.description}
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
          <div className="collectionDetailsCreator">
            <h4>Details about your new flashcard collection:</h4>
            <TextField 
              id="standard-basic" 
              label="Title" 
              name="title" 
            />
            <TextField
              id="standard-textarea"
              label="Description"
              placeholder="Placeholder"
              multiline
              name="description" 
            />
              
          </div> */}
          <Divider variant="middle" />
          {
              flashcardData.map((flashcard) => {
                  return (
                  <ReactCardFlip  key={flashcard.id} isFlipped={flashcard.isFlipped} flipDirection="horizontal">
                      <div className="front" className="cardContainer">
                        {flashcard.front_text}
                        <Button
                        className="flipButton"
                        variant="contained"
                        onClick={() => flipFlashcard(flashcard)}
                        >
                            Flip
                        </Button>
                    </div>
                      <div className="back" className="cardContainer">
                        {flashcard.back_text}
                        <Button
                        className="flipButton"
                        variant="contained"
                        onClick={() => flipFlashcard(flashcard)}
                        >
                            Flip
                        </Button>
                    </div>
                  </ReactCardFlip>
              )
              })
          }
      </div>
      );

      //https://www.npmjs.com/package/react-material-ui-carousel


}