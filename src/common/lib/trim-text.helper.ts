export const leftTrimText = (value = '', limit = 10) => {
  const length = value.length;
  if (length < limit) {
    return value;
  } else {
    return '...' + value.substring(length - limit);
  }
};

export const rightTrimText = (value = '', limit = 10) => {
  const length = value.length;
  if (length < limit) {
    return value;
  } else {
    return value.substring(0, limit) + '...';
  }
};
