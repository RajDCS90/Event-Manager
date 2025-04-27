const mongoose = require("mongoose")

const GrievanceSchema = new mongoose.Schema(
  {
    grievanceName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["complaint", "request", "feedback", "other"],
    },
    applicant: {
      type: String,
      required: true,
    },
    registeredOn: {
      type: Date,
      default: Date.now,
    },
    programDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
        message: (props) => `${props.value} is not a valid time format (HH:MM)`,
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
        message: (props) => `${props.value} is not a valid time format (HH:MM)`,
      },
    },
    status: {
      type: String,
      // enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: "pending",
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // Store image URL or file path
      required: false,
    },
  address: {
     mandal: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Mandal',
       required: true
     },
     mandalName: {
       type: String,
       required: true
     },
     area: {
       type: String,
       required: true
     },
     areaType: {
       type: String,
       enum: ['Panchayat', 'Ward'],
       required: true
     },
     village: {
       type: String,
       required: true
     },
     booth: {
       type: String,
       required: true
     },
     postOffice: {
       type: String,
       trim: true,
       required: true
     },
     policeStation: {
       type: String,
       trim: true,
       required: true
     },
     pincode: {
       type: String,
       trim: true,
       validate: {
         validator: v => /^[0-9]{6}$/.test(v),
         message: props => `${props.value} is not a valid pincode!`
       },
       required: true
     }
   },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resolutionNotes: {
      type: String,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Grievance", GrievanceSchema)
