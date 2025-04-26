"use client"

import { useState } from "react"
import EventRow from "./EventRow"
import EventDetail from "../Landing/EventDetail"

const EventList = ({ events, onEdit, onDelete }) => {
  const [detailEvent, setDetailEvent] = useState(null)

  const handleShowDetail = (event) => {
    setDetailEvent(event)
  }

  const handleCloseDetail = () => {
    setDetailEvent(null)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Event Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Venue
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date & Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Requester
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No events found
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <EventRow
                  key={event._id}
                  event={event}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onShowDetail={handleShowDetail}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal rendered outside of the table structure */}
      {detailEvent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <EventDetail
            event={{
              ...detailEvent,
              title: detailEvent.eventName,
              date: new Date(detailEvent.eventDate).toLocaleDateString(),
              time: `${detailEvent.startTime} - ${detailEvent.endTime}`,
              location: detailEvent.venue,
              description: detailEvent.description,
              image: detailEvent.imageUrl || "https:/https://images.pexels.com/photos/31756517/pexels-photo-31756517/free-photo-of-scenic-mountain-view-in-himachal-pradesh-india.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load/via.placeholder.com/800x400",
              gallery: detailEvent.gallery || [],
              address: detailEvent.address,
            }}
            onClose={handleCloseDetail}
          />
        </div>
      )}
    </>
  )
}

export default EventList
