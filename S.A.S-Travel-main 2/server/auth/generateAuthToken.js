const jwt = require("jsonwebtoken");

const generateAuthToken = (user, res) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.username,
      email: user.email,
  
    },
    ACCESS_TOKEN_SECRET, 
  );

 const results = {
  username: user.username,
  role: user.role,
  token: `Bearer ${token}`,
 };
 return results
};

module.exports = generateAuthToken;