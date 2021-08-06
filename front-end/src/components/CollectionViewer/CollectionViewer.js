import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import * as _ from 'underscore';
import Divider from '@material-ui/core/Divider';
import "./CollectionViewer.css";
import Carousel from 'react-material-ui-carousel'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';


// axios.defaults.baseURL = ""; 

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
    const defaultFlashcardData  = [{id: 1, isFlipped: false, front_text: "", back_text: "", front_image_key: null, back_image_key:null, createdAt: Date.now()}];
    const [collectionDetails, setCollectionDetails] = useState({title: "", description: "", public: true});
    const [flashcardData, setFlashcardData] = useState(defaultFlashcardData);


    const flipFlashcard = (flashcard) => {
      const otherFlashcards = flashcardData.filter(item => item.id !== flashcard.id);
      const updatedFlashcard = {...flashcard, isFlipped: !flashcard.isFlipped};

      //sorting to maintain the correct ordering
      setFlashcardData(_.sortBy([...otherFlashcards, updatedFlashcard], "id"));
    };


    useEffect(() => {
      const config = {
        headers: {
          "authorization": `Bearer ${localStorage.getItem("auth-token")}`
        }
      }
      
      axios.get(`/api/flashcard_collections/${id}`, config)
        .then((res) => {
          setCollectionDetails(res.data);
          return axios.get(`/api/flashcards/${id}`, config)
        })
        .then((res) => {
          console.log("success!");
          setFlashcardData(res.data);
          for(let i=0; i<res.data.length;i++){
            res.data[i] = {...res.data[i], isFlipped:false, createdAt:Date.now()}

          }
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response);
          if(err.response.status == 401){
            localStorage.removeItem("auth-token");
            localStorage.removeItem("user_id");
            return setTimeout(() => history.push("/login"), 800);
          }
        });

    }, []);

      return (
          
        <div className="collectionViewerContainer">
          <Fab className="backArrowButton" color="primary" aria-label="add" onClick={() => history.push("/")}>
                <ArrowBackIcon />
            </Fab>

          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
                {collectionDetails.title}
              </Typography>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
              {collectionDetails.description}
              </Typography>
            </Container>
          </div>
          <Divider variant="middle" />
          <Carousel
            autoPlay={false}
            navButtonsAlwaysVisible={true}
            NextIcon={<NavigateNextIcon/>}
            PrevIcon={<NavigateBeforeIcon/>}
            animation={"slide"}
            interval={500}
          >
          {
              flashcardData.map((flashcard) => {
                  return (
                          <ReactCardFlip  key={flashcard.id} isFlipped={flashcard.isFlipped} flipDirection="horizontal">
                              <div className="front" className="cardViewerContainer">
                              {
                                  flashcard.front_image_key ? 
                                  <div className>
                                    <h1 className="flashcardViewerTextWithImage">{flashcard.front_text}</h1>
                                    <div className="cardViewerImageContainer">
                                      <img  className="cardViewerImage" src={`http://localhost/api/images/${flashcard.front_image_key}`}/>
                                    </div>
                                  </div>
                                  :
                                  <div>
                                    <h1 className="flashcardViewerTextWithoutImage">{flashcard.front_text}</h1>
                                  </div>
                                }
                                <Button
                                className="flipButton"
                                variant="contained"
                                onClick={() => flipFlashcard(flashcard)}
                                >
                                    Flip
                                </Button>
                                {/* <div className="NavigateNextIconContainer">
                                  <Fab className="NavigateNextIcon" color="primary" aria-label="add" onClick={() => history.push("/")}>
                                      <NavigateNextIcon />
                                  </Fab>
                                </div>
                                <div className="NavigateBeforeIconContainer">
                                  <Fab className="NavigateBeforeIcon" color="primary" aria-label="add" onClick={() => history.push("/")}>
                                      <NavigateBeforeIcon />
                                  </Fab>
                                </div> */}
                            </div>
                              <div className="back" className="cardViewerContainer">
                                {
                                  flashcard.back_image_key ? 
                                  <div>
                                    <h1 className="flashcardViewerTextWithImage">{flashcard.back_text}</h1>
                                    <div className="cardViewerImageContainer">
                                      <img  className="cardViewerImage" src={`http://localhost/api/images/${flashcard.back_image_key}`}/>
                                    </div>
                                  </div>
                                  :
                                  <div>
                                    <h1 className="flashcardViewerTextWithImage">{flashcard.back_text}</h1>
                                  </div>
                                }
                                
                                <Button
                                className="flipButton"
                                variant="contained"
                                onClick={() => flipFlashcard(flashcard)}
                                >
                                    Flip
                                </Button>
                                {/* <div className="NavigateNextIconContainer">
                                  <Fab className="NavigateNextIcon" aria-label="add" onClick={() => history.push("/")}>
                                      <NavigateNextIcon />
                                  </Fab>
                                </div>
                                <div className="NavigateBeforeIconContainer">
                                  <Fab className="NavigateBeforeIcon" aria-label="add" onClick={() => history.push("/")}>
                                      <NavigateBeforeIcon />
                                  </Fab>
                                </div> */}
                            </div>
                          </ReactCardFlip>

                    );
                  }
              )
          }
          </Carousel>
        </div>
      );

      //https://www.npmjs.com/package/react-material-ui-carousel


}