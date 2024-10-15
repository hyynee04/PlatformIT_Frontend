import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { LuFile } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import default_image from "../assets/img/default_image.png";
import '../assets/scss/card/CenterCard.css';
import StarRatings from 'react-star-ratings';


const CenterCard = (props) => {
    const [imgCourse, setImgCourse] = useState("")

    return (
        <div className='course-card-container'>
            <Card>
                <img className='card-img-top' src={default_image} />
                <Card.Body>
                    <Card.Title>IT CENTER</Card.Title>
                    {/* <StarRatings
                        rating={2.403}
                        starRatedColor='rgb(255, 204, 0)'
                        // changeRating={this.changeRating}
                        starDimension="25px"
                        starSpacing="4px"
                        numberOfStars={5}
                        name='rating'
                    /> */}
                    <span className='center-infor'>Say something i'm giving up on you</span>
                </Card.Body>
                <div className='centercard-footer'>
                    <div className='centercard-group'>
                        <LuFile color='#757575' />
                        <span className='now-price'>100</span>
                    </div>
                    <div className='centercard-group'>
                        <span className='now-price'>100</span>
                        <RiGroupLine color='#757575' />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CenterCard;