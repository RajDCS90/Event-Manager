"use client"
import { Edit, Trash } from "lucide-react"

const EventRow = ({ event, onEdit, onDelete, onShowDetail }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <button onClick={() => onShowDetail(event)} className="text-blue-600 hover:text-blue-800 hover:underline">
          {event.eventName}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap capitalize">{event.eventType}</td>
      <td className="px-6 py-4 whitespace-nowrap">{event.venue}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {new Date(event.eventDate).toLocaleDateString()} | {event.startTime} - {event.endTime}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            event.status === "completed"
              ? "bg-green-100 text-green-800"
              : event.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {event.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{event.requesterName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <button onClick={() => onEdit(event)} className="text-green-600 hover:text-green-900">
          <Edit className="h-5 w-5" />
        </button>
        <button onClick={() => onDelete(event._id)} className="text-red-600 hover:text-red-900">
          <Trash className="h-5 w-5" />
        </button>
      </td>
    </tr>
  )
}

export default EventRow
