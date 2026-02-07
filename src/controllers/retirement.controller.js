// export function logger(req, res, next) {
//   console.log("Request Method: ", req.method);
//   console.log("Request URL: ", req.url);
//   next();
// }

export const testRetirement = (req, res) => {
  console.log('--- RETIREMENT TEST ---');

  if (!req.session.userId) {
    console.log('No user logged in');
    return res.status(401).json({ error: 'Not logged in' });
  }

  const { account_type, amount } = req.body;

  console.log(`User ID: ${req.session.userId}`);
  console.log(`User Email: ${req.session.email}`);
  console.log(`Account Type: ${account_type}`);
  console.log(`Amount Entered: ${amount}`);

  res.json({ success: true });
};