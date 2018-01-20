import React, { Component } from 'react';

import './EventCard.css';



export default class EventCard extends Component {

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);        
    }

    handleModalClose() {
        const { setActiveSuggestion } = this.props;
        setActiveSuggestion(undefined);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        const { suggestion } = this.props;
        if (!suggestion) return null;
        return (
            <div className={`modal ${suggestion ? "is-active" : ""}`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div id="eventCardContainer">
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-4by3">
                                <img src={suggestion.image_url}  alt="Meaninful text" />
                                </figure>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-4">{suggestion.name}</p>
                                        <p className="subtitle is-6">{suggestion.phone}</p>
                                    </div>
                                </div>

                                <div className="content">
                                    {suggestion.location.display_address.map( (addr, i) => {
                                        return <p key={`addr${i}`}>{addr}</p>
                                    })}
                                    <p>{`Rating: ${suggestion.rating}/5`}</p>
                                </div>
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-link">Submit</button>
                            </div>
                            <div className="control">
                                <button 
                                className="button is-text"
                                onClick={this.handleModalClose.bind(this)}
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                className="modal-close is-large" 
                aria-label="close"
                onClick={this.handleModalClose.bind(this)}
                ></button>
            </div>
        )
    }
}