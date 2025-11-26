export const defaultAdminProfile = {
  firstName: '',
  lastName: '',
  username: '',
  role: '',
  email: '',
};

const deriveProfile = (rawProfile = {}) => {
  const merged = { ...defaultAdminProfile, ...rawProfile };
  let firstName = merged.firstName;
  let lastName = merged.lastName;

  if ((!firstName || !lastName) && merged.name) {
    const parts = merged.name.trim().split(' ');
    firstName = parts.shift();
    lastName = parts.join(' ');
  }

  const fullNameCandidate = merged.name || [firstName, lastName].filter(Boolean).join(' ').trim();
  const fullName = fullNameCandidate || `${defaultAdminProfile.firstName} ${defaultAdminProfile.lastName}`;

  const initials = `${(firstName || fullName).charAt(0)}${(lastName || fullName.split(' ').slice(-1)[0] || '').charAt(0)}`
    .trim()
    .toUpperCase();

  return {
    ...merged,
    firstName: firstName || merged.firstName,
    lastName: lastName || merged.lastName,
    name: fullName,
    fullName,
    initials: initials || `${defaultAdminProfile.firstName.charAt(0)}${defaultAdminProfile.lastName.charAt(0)}`.toUpperCase(),
    username: merged.username || (merged.email ? merged.email.split('@')[0] : defaultAdminProfile.username),
  };
};

export const getStoredAdminProfile = () => {
  if (typeof localStorage === 'undefined') return deriveProfile();

  try {
    const stored = localStorage.getItem('adminProfile');
    if (!stored) return deriveProfile();

    const parsed = JSON.parse(stored);
    return deriveProfile(parsed);
  } catch (error) {
    console.error('Failed to read stored admin profile', error);
    return deriveProfile();
  }
};

export const setStoredAdminProfile = (profile) => {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.setItem('adminProfile', JSON.stringify(profile));

    if (typeof window !== 'undefined') {
      const derivedProfile = deriveProfile(profile);
      window.dispatchEvent(new CustomEvent('adminProfileUpdated', { detail: derivedProfile }));
    }
  } catch (error) {
    console.error('Failed to persist admin profile', error);
  }
};

export default defaultAdminProfile;
