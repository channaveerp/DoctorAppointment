export const catchAsyncErrors = (thefunction) => {
  return (req, res, next) => {
    Promise.resolve(req, res, next).catch(next);
  };
};
