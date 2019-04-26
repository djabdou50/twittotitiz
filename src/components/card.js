import React, {Component} from 'react';

class Card extends Component {
    render() {

        return this.props.selfies.map( selfie => {

            return (
                <div className="col-sm-12 col-md-6" key={selfie.id}>
                    <div className="card mb-4 box-shadow">
                        <img className="card-img-top"
                             src={selfie.media}
                             alt={selfie.username} />
                        <div className="card-body">
                            <p className="card-text">{selfie.text}</p>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group">
                                    <button type="button"
                                            className="btn btn-sm btn-outline-secondary">Tweet
                                    </button>
                                    <button type="button"
                                            className="btn btn-sm btn-outline-secondary">User
                                    </button>
                                </div>
                                <small className="text-muted">@{selfie.screen_name}</small>
                            </div>
                        </div>
                    </div>
                </div>
            );

        })

    }
}

export default Card;