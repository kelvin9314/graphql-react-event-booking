import React from 'react';

import '../../../../styles/EventItem.css'

const eventItem = props => (
  <li key={props.eventID} className="events__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
    </div>
    <div>
      { props.userID === props.creatorID 
        ? (<p>You are the owner of this event</p>) 
        : ( <button 
              className="btn"
              onClick={props.onDetail.bind(this, props.eventID)}
            >
              View Details
            </button>
          )}
    </div>
  </li>
)

export default eventItem