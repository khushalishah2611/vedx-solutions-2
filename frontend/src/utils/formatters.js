export const createAnchorHref = (label) => {
  if (!label) {
    return '#';
  }

  return `#${label
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')}`;
};
