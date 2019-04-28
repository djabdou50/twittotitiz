import React, {Component} from 'react';

class Card extends Component {

    handledetails = (data) => {
        this.props.renderdetails(data)
    }
    render() {
        return this.props.selfies.map( selfie => {
            return (
                <div key={selfie.id}>
                    <img className="card-img" onClick={() => this.handledetails(selfie)} src={selfie.media} alt={selfie.username}/>
                </div>
            );

        })

    }
}

export default Card;