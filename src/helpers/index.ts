function textLimiter(str: string, limit: number) {
  if (str.length > limit) {
    return str.slice(0, limit - 5) + '...';
  }

  return str;
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export { textLimiter, randomNumber };
