export const main = async (event, context, callback) => {
  const result = {
    'status': 'Received input: ' + JSON.stringify(event.body)
  };

  return context
    .status(200)
    .succeed(result);
};
