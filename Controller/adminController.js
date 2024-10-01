
const jwt = require('jsonwebtoken');
const admins=require('../Model/AdminModel')
const bcrypt = require('bcrypt');

// exports.login = (req, res) => {
//   const { username, password } = req.body;

//   if (username === hardcodedUsername && password === hardcodedPassword) {
//     req.session.userId = username;
//     res.status(200).json({ message: 'Login successful' });
//   } else {
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// };




exports.adminregister = async (req, res) => {
    console.log("Inside Register request");
    const { username, password } = req.body;
    console.log(username, password);
  
    try {
        const existingUser = await admins.findOne({ username });
        if (existingUser) {
            return res.status(406).json("User Already exists");
        } else {
            // Hash the password before saving
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
  
            const newUser = new admins({
                username,
                password: hashedPassword // store hashed password
            });
            await newUser.save();
            return res.status(200).json(newUser);
        }
    } catch (err) {
        return res.status(401).json(err);
    }
  };
 
exports.adminlogin = async (req, res) => {
    console.log("Inside login function");
    const { username, password } = req.body;
    console.log("Login attempt for username:", username);
    
    try {
      const existingUser = await admins.findOne({ username });
      if (existingUser) {
        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (isPasswordValid) {
          // Generate token
          const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET);
          console.log("Login successful, token generated:", token);
          return res.status(200).json({ user: existingUser, token });
        } else {
          console.log("Invalid password for username:", username);
          return res.status(401).json({ message: "Invalid credentials" });
        }
      } else {
        console.log("User not found:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


exports.adminlogout = (req, res) => {
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
