const hardcodedUsername = 'user';
const hardcodedPassword = 'secured132';

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === hardcodedUsername && password === hardcodedPassword) {
    req.session.userId = username;
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.clearCookie('connect.sid'); // Add this line to clear the session cookie
    res.status(200).json({ message: 'Logout successful' });
  });
};

// exports.checkAuthentication = (req, res) => {
//   if (req.session.user) {
//     res.json({ authenticated: true, user: req.session.user });
//   } else {
//     res.json({ authenticated: false });
//   }
// };


// const adminCredentials = {
//     username: 'najiya',
//     password: 'naji123'
// };

// // Admin login controller
// exports.login = (req, res) => {
//     const { username, password } = req.body;

//     if (username === adminCredentials.username && password === adminCredentials.password) {
//         res.status(200).json({ message: 'Login successful' });
//     } else {
//         res.status(401).json({ message: 'Invalid username or password' });
//     }
// };

// exports.logout = (req, res) => {
//     if (req.session.isAdmin) {
//       req.session.destroy(err => {
//         if (err) {
//           return res.status(500).json({ message: 'Logout failed' });
//         }
//         res.status(200).json({ message: 'Logout successful' });
//       });
//     } else {
//       res.status(400).json({ message: 'No active session' });
//     }
//   };
