const randomStringGenerator = () => {
  const randomString = Array.from(Array(10), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");

  return randomString;
}; //orderNum 만들기

module.exports = { randomStringGenerator };
