import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { LuFile } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/card/Card.css";
import StarRatings from 'react-star-ratings';


const CenterCard = (props) => {
    const [imgCourse, setImgCourse] = useState("")

    return (
        <div className='card-container'>
            <div className='center-card-container'>
                <img src={default_image} />
                <div className='center-card-body'>
                    <span className="center-card-title">IT CENTER</span>
                    {/* <StarRatings
                        rating={2.403}
                        starRatedColor='rgb(255, 204, 0)'
                        // changeRating={this.changeRating}
                        starDimension="25px"
                        starSpacing="4px"
                        numberOfStars={5}
                        name='rating'
                    /> */}
                    <span className='center-card-quote'>
                        Say something I'm giving up on you
                    </span>
                </div>
                <div className='center-card-footer'>
                    <div className='center-card-info'>
                        <LuFile color='#757575' /> 
                        <span>100</span> 
                    </div>
                    <div className='center-card-info'>
                        <span>100</span> 
                        <RiGroupLine color='#757575' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CenterCard;