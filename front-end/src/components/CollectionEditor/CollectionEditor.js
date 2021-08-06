import { useHistory,  useParams} from "react-router-dom";
import { useState , useEffect} from "react";
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import "../CollectionCreator/CollectionCreator.css";
import "./CollectionEditor.css";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as _ from 'underscore';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Divider from '@material-ui/core/Divider';
import Dropzone from 'react-dropzone'





export default function CollectionEditor() {
  const defaultFlashcardData  = [{id: 1, isFlipped: false, front_text: "", back_text: "", front_image_key: null, back_image_key: null, createdAt: Date.now()}];
  const [collectionDetails, setCollectionDetails] = useState({title: "", description: "", public: true});
    const [flashcardData, setFlashcardData] = useState(defaultFlashcardData);
    const history = useHistory();
    const {id} = useParams();


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





    const handleSubmit = (event) => {
        event.preventDefault(); // ensure page doesn't reload 
        const config = {
            headers: {
              "authorization": `Bearer ${localStorage.getItem("auth-token")}`
            }
        }
        const payload = {
          title: collectionDetails.title,
          public: collectionDetails.public,
          description: collectionDetails.description,
          public: collectionDetails.public,
          flashcards: flashcardData
        }   
        
        axios.put(`api/flashcard_collections/${id}`, payload, config)
          .then((res) => {
            setTimeout(() => history.push("/"), 800);
          })
          .catch((err) => {
            if(err.response.status == 401){
              localStorage.removeItem("auth-token");
              localStorage.removeItem("user_id");
              return setTimeout(() => history.push("/login"), 800);
            }
          });
      };

      const handleDelete = (event) => {
        const config = {
          headers: {
            "authorization": `Bearer ${localStorage.getItem("auth-token")}`
          }
        }
        
        axios.delete(`/api/flashcard_collections/${id}`, config)
          .then((res) => setTimeout(() => history.push("/"), 800))
          .catch((err) => {
            if(err.response && err.response.status == 401){
              localStorage.removeItem("auth-token");
              localStorage.removeItem("user_id");
              return setTimeout(() => history.push("/login"), 800);
            }
          });
      }

      const handleClickForNewFlashcard = (event) => {
        const newFlashcard =  {id: flashcardData[flashcardData.length - 1].id + 1, front_text: "", back_text: "", front_image_key: null, back_image_key: null, createdAt: Date.now()};

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
        const newFlashcards = _.sortBy([...otherFlashcards, updatedFlashcard], "id")
        setFlashcardData(newFlashcards);
      };

      const handleUpdatingFlashcardDataText =(event, flashcard) => {
        const otherFlashcards = flashcardData.filter(item => item.id !== flashcard.id);
        
        let updatedFlashcard;
        if(event.target.name == "front-input") updatedFlashcard = {...flashcard, front_text: event.target.value};
        else updatedFlashcard = {...flashcard, back_text: event.target.value};
        //sorting to maintain the correct ordering
        setFlashcardData(_.sortBy([...otherFlashcards, updatedFlashcard], "id"));
      }

      const handleFileUpload = async (files, flashcard, is_front) => {
        if(files.length == 0) return console.error("files array is empty");
       
        const formData = new FormData();
        formData.append("image", files[0]);
        axios.post("api/images", formData, { headers: {'Content-Type': 'multipart/form-data', "authorization": `Bearer ${localStorage.getItem("auth-token")}`}})
          .then((result) => {
            const otherFlashcards = flashcardData.filter(item => item.id !== flashcard.id);
            let updatedFlashcard;
            if(is_front) updatedFlashcard = {...flashcard, front_image_key: result.data.imageKey};
            else updatedFlashcard = {...flashcard, back_image_key: result.data.imageKey};

            //sorting to maintain the correct ordering
            setFlashcardData(_.sortBy([...otherFlashcards, updatedFlashcard], "id"));
          })
          .catch((err) => {
            console.error(err.response);
            if(err.response.status == 401){
              localStorage.removeItem("auth-token");
              localStorage.removeItem("user_id");
              return setTimeout(() => history.push("/login"), 800);
            }
          })
                        
      }





      return (
          
        <div className="collectionEditorContainer">
            <Fab className="backArrowButton" color="primary" aria-label="add" onClick={() => history.push("/")}>
                <ArrowBackIcon />
            </Fab>
            

            <div className="collectionDetailsCreator">
              <h4>Details about your new flashcard collection:</h4>
              <TextField 
                id="standard-basic" 
                label="Title" 
                name="title" 
                value={collectionDetails.title}
                onChange={(e) => setCollectionDetails({...collectionDetails, [e.target.name]:e.target.value})} />
              <TextField
                id="standard-textarea"
                label="Description"
                placeholder="Placeholder"
                multiline
                name="description" 
                value={collectionDetails.description}
                onChange={(e) => setCollectionDetails({...collectionDetails, [e.target.name]:e.target.value})}/>
                
            </div>
            <Divider variant="middle" />
            {
                flashcardData.map((flashcard) => {
                    return (
                    <ReactCardFlip  key={flashcard.id} isFlipped={flashcard.isFlipped} flipDirection="horizontal">
                        <div className="front" className="cardContainer">
                          <h2 className="cardQuestionHeader">What would you like to have on the front of this card?</h2>
                          <TextField
                          id="outlined-textarea"
                          multiline
                          rows={3}
                          name="front-input"
                          placeholder={"For example:\n\nHow do you say \"thank you\" in french?"}
                          variant="outlined"
                          value={flashcard.front_text}
                          onChange={(event) => handleUpdatingFlashcardDataText(event, flashcard)}
                          />
                          {
                            flashcard.front_image_key ?
                            <>
                              <img className={"editorCardImageWithDropZone"} src={`http://localhost/api/images/${flashcard.front_image_key}`}/>
                              <div className="editorDropzoneContainerWithImage">
                                <Dropzone 
                                  maxFiles={1}
                                  maxSize={10000000} // 10MB
                                  accept={['image/jpeg', 'image/png', 'image/jpg']}
                                  onDropAccepted={acceptedFiles => handleFileUpload(acceptedFiles, flashcard, true)}
                                >
                                  {({getRootProps, getInputProps}) => (
                                    <section >
                                      <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p className="dropzone">Upload an image (Optional)</p>
                                      </div>
                                    </section>
                                  )}
                                </Dropzone>
                              </div>
                            </>
                              :
                              <div className="dropzoneContainer">
                                <Dropzone 
                                  maxFiles={1}
                                  maxSize={10000000} // 10MB
                                  accept={['image/jpeg', 'image/png', 'image/jpg']}
                                  onDropAccepted={acceptedFiles => handleFileUpload(acceptedFiles, flashcard, true)}
                                >
                                  {({getRootProps, getInputProps}) => (
                                    <section >
                                      <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p className="dropzone">Upload a different image (Optional)</p>
                                      </div>
                                    </section>
                                  )}
                                </Dropzone>
                              </div>
                          }
                          
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
                          <h2 className="cardQuestionHeader">What would you like to have on the back of this card?</h2>
                          <TextField
                          id="outlined-textarea"
                          multiline
                          rows={3}
                          name="back-input"
                          placeholder={"For example (continuing with previous example):\n\n \"Merci\" "}
                          variant="outlined"
                          value={flashcard.back_text}
                          onChange={(event) => handleUpdatingFlashcardDataText(event, flashcard)}
                          />
                          {
                            flashcard.back_image_key ?
                            <>
                              <img className={"editorCardImageWithDropZone"} src={`http://localhost/api/images/${flashcard.back_image_key}`}/>
                              <div className="editorDropzoneContainerWithImage">
                                <Dropzone 
                                  maxFiles={1}
                                  maxSize={10000000} // 10MB
                                  accept={['image/jpeg', 'image/png', 'image/jpg']}
                                  onDropAccepted={acceptedFiles => handleFileUpload(acceptedFiles, flashcard, false)}
                                >
                                  {({getRootProps, getInputProps}) => (
                                    <section >
                                      <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p className="dropzone">Upload a different image (Optional)</p>
                                      </div>
                                    </section>
                                  )}
                                </Dropzone>
                              </div>
                            </>
                              :
                              <div className="dropzoneContainer">
                                <Dropzone 
                                  maxFiles={1}
                                  maxSize={10000000} // 10MB
                                  accept={['image/jpeg', 'image/png', 'image/jpg']}
                                  onDropAccepted={acceptedFiles => handleFileUpload(acceptedFiles, flashcard, false)}
                                >
                                  {({getRootProps, getInputProps}) => (
                                    <section >
                                      <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p className="dropzone">Upload an image (Optional)</p>
                                      </div>
                                    </section>
                                  )}
                                </Dropzone>
                              </div>
                          }
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
            <div>
              <Button
                variant="contained"
                color="primary"
                size="large"
                style={{color:"white", borderRadius:"10%", marginTop:"30px"}}
                startIcon={<DoneOutlineIcon />}
                onClick={handleSubmit}
              >
                Update
              </Button>
              
            </div>
            <div>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                style={{color:"white", borderRadius:"10%", marginTop:"30px"}}
                startIcon={<DoneOutlineIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
        </div>
      );


}