import React, { useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import "./StarRating.css"



export default function StarRating({is_input, collection}) {

  return (
    <div className="starRatingContainer">
        {is_input === false ? 
           
              <StarRatings
                  starRatedColor="#ebc700"
                  rating={(collection.sumratings / collection.numratings) ? (collection.sumratings / collection.numratings): 0}
                  numberOfStars={5}
                  name='rating'
                  starEmptyColor="grey"
                  starDimension="15px"
              />
          :
              <StarRatings
                  starRatedColor="#ebc700"
                  rating={(collection.sumratings / collection.numratings) ? (collection.sumratings / collection.numratings): 0}
                  numberOfStars={5}
                  name='rating'
                  starHoverColor="#303f9f"
                  starEmptyColor="grey"
                  changeRating={(rating) => console.log(rating)}
                  starDimension="15px"
              />
          }     
      </div>
  );
}