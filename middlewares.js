import { verifyJWTToken } from './libs/Auth';

export function verifyJWT_MW(req, res, next)
{
  // (req.method === 'POST'); we could check method and change what we do depending
  let token = req.headers['x-access-token'];
  verifyJWTToken(token)
    .then((decodedToken) =>
    {
      req.user = decodedToken.data;
      next();
    })
    .catch((err) =>
    {
      res.status(400)
        .json({ auth: false, token: null, message: 'Invalid auth token provided.' });
    });
};
