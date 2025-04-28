const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

// Validate encryption configuration
function validateEncryptionConfig() {
  console.log('object',process.env.ENCRYPTION_KEY)
  if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
    throw new Error('Missing encryption configuration in .env file');
  }

  // Verify key is 64 hex chars (32 bytes)
  if (!/^[0-9a-f]{64}$/i.test(process.env.ENCRYPTION_KEY)) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  }

  // Verify IV is 32 hex chars (16 bytes)
  if (!/^[0-9a-f]{32}$/i.test(process.env.ENCRYPTION_IV)) {
    throw new Error('ENCRYPTION_IV must be 32 hex characters (16 bytes)');
  }
}

try {
  validateEncryptionConfig();
} catch (error) {
  console.error('Encryption configuration error:', error.message);
  process.exit(1); // Exit if config is invalid
}

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

// Encryption function
function encrypt(text) {
  try {
    if (typeof text !== 'string') {
      text = String(text);
    }
    text = text.trim();
    
    if (!/^\d{12}$/.test(text)) {
      throw new Error('Aadhar must be exactly 12 digits');
    }

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error.message);
    throw new Error(`Failed to encrypt Aadhar: ${error.message}`);
  }
}

// Decryption function
function decrypt(encrypted) {
  try {
    if (!encrypted || typeof encrypted !== 'string') return encrypted;
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    return '********'; // Return masked value
  }
}

const PartyAndYouthSchema = new mongoose.Schema({
  aadharNo: {
    type: String,
    required: [true, 'Aadhar number is required'],
    unique: true,
    set: encrypt,
    get: decrypt
  },
  name: {
    type: String,
    required: true
  },
  whatsappNo: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  address: {
    mandal: {
      type: String,
      required: true
    },
    areaType: {
      type: String,
      enum: ['Panchayat', 'Ward'],
      required: true
    },
    area: {
      type: String,
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
    policeStation: {
      type: String,
      required: true
    },
    postOffice: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: function(v) {
          return /^[0-9]{6}$/.test(v); // Indian pincode validation (6 digits)
        },
        message: props => `${props.value} is not a valid pincode!`
      }
    },
    landmark: {
      type: String
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: { getters: true }, // Ensure getters are applied when converting to JSON
  toObject: { getters: true }
});

module.exports = mongoose.model('PartyAndYouth', PartyAndYouthSchema);