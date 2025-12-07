const generateId = () => {
  return new Date().getTime() + Math.floor(Math.random() * 1000);
};

export default generateId;
