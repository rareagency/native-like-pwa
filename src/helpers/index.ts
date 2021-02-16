function textLimiter(str: string, limit: number) {
  if (str.length > limit) {
    return str.slice(0, limit - 5) + '...';
  }

  return str;
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function iOS() {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

export { textLimiter, randomNumber, iOS };
