// src/data/initialData.js
export const initialEvents = [
    {
      id: 1,
      eventName: 'Community Meeting',
      eventType: 'Social',
      venue: 'Town Hall',
      status: 'Completed',
      mandalPanchayat: 'Mandal 1',
      requesterName: 'John Doe',
      requesterContact: '9876543210'
    },{
      id: 2,
      eventName: 'Social Meeting',
      eventType: 'Virtual Meeting',
      venue: 'Biju Hall',
      status: 'Pending',
      mandalPanchayat: 'Mandal 2',
      requesterName: 'John Doe',
      requesterContact: '9876543210'
    },
    // More sample events...
  ];
  
  export const initialGrievances = [
    {
      id: 1,
      grievanceName: 'Road Repair',
      type: 'Infrastructure',
      applicant: 'Jane Smith',
      registeredOn: '2023-05-15',
      status: 'Pending',
      description: 'Main road needs repair after monsoon',
      assignedTo: 'Public Works Dept'
    },{
      id: 2,
      grievanceName: 'PRoject Completion',
      type: 'Manager',
      applicant: 'Steve Smith',
      registeredOn: '2023-05-17',
      status: 'Pending',
      description: 'Main road needs repair after monsoon',
      assignedTo: 'Public Works Dept'
    },
    // More sample grievances...
  ];
  
  export const initialPartyYouth = [
    {
      id: 1,
      aadharNo: '123456789012',
      name: 'Rahul Sharma',
      whatsappNo: '9876543210',
      designation: 'Youth Leader',
      mandalPanchayat: 'Mandal 2'
    },
    {
      id: 2,
      aadharNo: '123456789012',
      name: 'Rahul Sharma',
      whatsappNo: '67876543210',
      designation: 'Youth Leader',
      mandalPanchayat: 'Mandal 4'
    },
    {
      id: 3,
      aadharNo: '123456789012',
      name: 'Rahul Sharma',
      whatsappNo: '9876544210',
      designation: 'Manager',
      mandalPanchayat: 'Mandal 7'
    },
    // More sample members...
  ];
  
  export const initialUsers = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // In real app, store hashed passwords
      role: 'admin',
      access: ['events', 'grievances', 'partyYouth', 'userManagement']
    },
    {
      id: 2,
      name: 'Lisa',
      email: 'Lisa@example.com',
      password: 'Lisa123',
      role: 'user',
      access: ['events']
    },
    {
      id: 3,
      name: 'Raj',
      email: 'Raj@example.com',
      password: 'Raj123',
      role: 'user',
      access: ['events','grievances']
    },
    // More sample users...
  ];