const adminProfile = {
  firstName: 'Priya',
  lastName: 'Patel',
  username: 'vedx-admin',
  role: 'System Administrator',
  email: 'admin@vedxsolution.com',
  phone: '+91 98765 43210'
};

adminProfile.fullName = `${adminProfile.firstName} ${adminProfile.lastName}`;
adminProfile.initials = `${adminProfile.firstName.charAt(0)}${adminProfile.lastName.charAt(0)}`;

export default adminProfile;
