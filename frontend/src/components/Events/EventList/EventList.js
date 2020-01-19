import React  from 'react';

import EventItem from './EventItem/EventItem'
import '../../../styles/EventList.css'

const eventList = props =>{ 
  const events = props.events.map(event => {
    return (
      <EventItem 
        key={event._id}
        eventID={event._id}
        title={event.title}
        userID={props.authUserID}
        creatorID={event.creator._id}
        price={event.price}
        date={event.date}
        onDetail={props.onViewDetail}
      />
    )
  })

  return (
    <ul className="event__list">
      {events}
    </ul>
  )
}

export default eventList