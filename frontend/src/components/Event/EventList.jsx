import { useState } from "react"
import EventRow from "./EventRow"
import EventDetail from "../Landing/EventDetail"

const EventList = ({ events, onEdit, onDelete }) => {
  const [detailEvent, setDetailEvent] = useState(null)

  const handleShowDetail = (event) => {
    console.log(event)
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
        <EventDetail
          event={detailEvent}
          onClose={handleCloseDetail}
        />
      )}
    </>
  )
}

export default EventList