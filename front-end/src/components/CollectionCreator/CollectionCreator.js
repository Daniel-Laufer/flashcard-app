import { useHistory } from "react-router-dom";
import { useState } from "react";
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import "./CollectionCreator.css";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as _ from 'underscore';





const  uuid = require('uuid');



export default function CollectionCreator() {
    const defaultFlashcardData  = [{id: 1, isFlipped: false, frontText: "", backText: "", createdAt: Date.now()}];
    const [collectionDetails, setCollectionDetails] = useState({title: "", description: "", public: true});
    const [flashcardData, setFlashcardData] = useState(defaultFlashcardData);
    const history = useHistory();


    const handleSubmit = (event) => {
        event.preventDefault(); // ensure page doesn't reload 
        const config = {
            headers: {
                "auth-token": localStorage.getItem("auth-token")
            }
        }
        const payload = {
          title: collectionDetails.title,
          description: collectionDetails.description,
          public: collectionDetails.public,
          flashcards: flashcardData
        }   
        
        axios.post("api/flashcard_collections/", payload, config)
          .then((res) => {
            setTimeout(() => history.push("/"), 800);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const handleClickForNewFlashcard = (event) => {
        const newFlashcard =  {id: flashcardData[flashcardData.length - 1].id + 1, frontText: "", backText: "", createdAt: Date.now()};
        
        setFlashcardData([...flashcardData, newFlashcard]);

      };

      const handleDeleteCard = (flashcard) => {
        if(flashcardData.length === 1) return setFlashcardData(defaultFlashcardData);
        setFlashcardData(flashcardData.filter((item) => item.id !== flashcard.id));
      };

      const flipFlashcard = (flashcard) => {
        const otherFlashcards = flashcardData.filter(item => item.id !== flashcard.id);
        const updatedFlashcard = {...flashcard, isFlipped: !flashcard.isFlipped};

        //sorting to maintain the correct ordering
        setFlashcardData(_.sortBy([...otherFlashcards, updatedFlashcard], "createdAt"));
      };




      return (
          
        <div className="collectionCreatorContainer">
            <Fab className="backArrowButton" color="primary" aria-label="add" onClick={() => history.push("/")}>
                <ArrowBackIcon />
            </Fab>
            {
                flashcardData.map((flashcard) => {
                    return (
                    <ReactCardFlip  key={flashcard.id} isFlipped={flashcard.isFlipped} flipDirection="horizontal">
                        <div className="front" className="cardContainer">
                          <h2 className="cardQuestionHeader">What would you like to have on the front of this card?</h2>
                          <TextField
                          id="outlined-textarea"
                          multiline
                          rows={6}
                          placeholder={"For example:\n\nHow do you say \"thank you\" in french?"}
                          variant="outlined"
                          />
                          <Button
                          className="flipButton"
                          variant="contained"
                          onClick={() => flipFlashcard(flashcard)}
                          >
                              Flip
                          </Button>
                          <Fab className="deleteCardButton" color="secondary" aria-label="delete" onClick={() => handleDeleteCard(flashcard)}>
                              <DeleteOutlineIcon />
                          </Fab>
                      </div>
                        <div className="back" className="cardContainer">
                          <h2 className="cardQuestionHeader">What would you like to have on the front of this card?</h2>
                          <TextField
                          id="outlined-textarea"
                          multiline
                          rows={6}
                          placeholder={"For example:\n\nHow do you say \"thank you\" in french?"}
                          variant="outlined"
                          />
                          <Button
                          className="flipButton"
                          variant="contained"
                          onClick={() => flipFlashcard(flashcard)}
                          >
                              Flip
                          </Button>
                          <Fab className="deleteCardButton" color="secondary" aria-label="delete" onClick={() => handleDeleteCard(flashcard)}>
                              <DeleteOutlineIcon />
                          </Fab>
                      </div>
                    </ReactCardFlip>
                )
                })
            }
            <Fab className="addCardButton" color="primary" aria-label="add" onClick={handleClickForNewFlashcard}>
              <AddIcon />
            </Fab>
        </div>
      );


}