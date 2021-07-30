import React from 'react';
import StarRatings from 'react-star-ratings';
import "./StarRating.css"



export default function StarRating({is_input}) {


  return (
    <div className="starRatingContainer">
        {is_input === false ? 
           
              <StarRatings
                  rating={4}
                  starRatedColor="#ebc700"
                  numberOfStars={5}
                  name='rating'
                  starDimension="15px"
              />
          :
              <StarRatings
                  rating={4}
                  starRatedColor="#ebc700"
                  numberOfStars={5}
                  name='rating'
                  starHoverColor="#303f9f"
                  changeRating={(rating) => console.log(rating)}
                  starDimension="15px"
              />
          }     
      </div>
  );
}