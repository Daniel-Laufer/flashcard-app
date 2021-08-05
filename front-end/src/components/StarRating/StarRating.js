import React, {useState} from 'react';
import { useHistory} from "react-router-dom";
import StarRatings from 'react-star-ratings';
import "./StarRating.css"
import axios from 'axios';


export default function StarRating({is_input, collection}) {
    const history = useHistory();
    const [ratingGiven, setRatingGiven] = useState(null);

    const handleChangeStarRating = (rating) => {
        const config = {
            headers: {
              "authorization": `Bearer ${localStorage.getItem("auth-token")}`
            }
        }
        const payload = {
          rating
        }   
        
        axios.put(`api/flashcard_collections/${collection.id}/rating`, payload, config)
          .then((res) => {
              setRatingGiven(rating);
            setTimeout(() => history.push("/"), 800);
          })
          .catch((err) => {
            if(err.response.status === 401){
              localStorage.removeItem("auth-token");
              localStorage.removeItem("user_id");
              return setTimeout(() => history.push("/login"), 800);
            }
          });
    }


  return (
    <div className="starRatingContainer">
        {
            ratingGiven == null ? 

            <StarRatings
                starRatedColor="#ebc700"
                rating={(collection.sumratings / collection.numratings) ? (collection.sumratings / collection.numratings): 0}
                numberOfStars={5}
                name='rating'
                starHoverColor="#ff9500"
                starEmptyColor="grey"
                changeRating={(rating) => handleChangeStarRating(rating)}
                starDimension="15px"
            /> 
            :
            <StarRatings
                starRatedColor="#ff9500"
                rating={ratingGiven}
                numberOfStars={5}
                name='rating'
                starEmptyColor="grey"
                starDimension="15px"
            /> 


        }
        
      </div>
  );
}