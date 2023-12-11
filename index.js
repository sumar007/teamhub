// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');


// const app = express();
// const port = 4000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });



// // Define the user schema
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   // profile_picture: String,

// });

// // Add the comparePassword method to the user schema
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   try {
//     return await bcrypt.compare(candidatePassword, this.password);
//   } catch (error) {
//     throw new Error(error);
//   }
// };
// // Create the user model
// const User = mongoose.model('User', userSchema);




// // Login route
// app.post('/login', async (req, res) => {
//   // Retrieve login credentials from the request body
//   const { username, password } = req.body;

//   try {
//     // Find the user in the database
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Compare the provided password with the stored hashed password
//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//       // Password doesn't match
//       return res.status(401).json({ message: 'Incorrect password' });
//     }

//     // Password matches, login successful
//     return res.status(200).json({ message: 'Login successful', user });
//   } catch (error) {
//     console.error('Login error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });
  
  
// //   // Register route
// // app.post('/register', (req, res) => {
// //     // Retrieve registration data from the request body
// //     const { username, email, password } = req.body;
  
// //     // Check if a user with the provided email or username already exists
// //     User.findOne({ $or: [{ username }, { email }] })
// //       .then(existingUser => {
// //         if (existingUser) {
// //           // A user with the same email or username already exists
// //           return res.status(400).json({ error: 'User already exists' });
// //         }
  
// //         // Create a new user with the provided data
// //         const user = new User({
// //           username,
// //           email,
// //           password
// //         });
  
// //         // Save the user to the database
// //         user.save()
// //           .then(savedUser => {
// //             // Handle successful user save
// //             console.log('User saved:', savedUser);
// //             res.json({ message: 'Registration successful' });
// //           })
// //           .catch(error => {
// //             // Handle user save error
// //             console.error('User save error:', error);
// //             res.status(500).json({ error: 'Failed to register user' });
// //           });
// //       })
// //       .catch(error => {
// //         console.error('User lookup error:', error);
// //         res.status(500).json({ error: 'Failed to register user' });
// //       });
// //   });
// // Register route
// app.post('/register', async (req, res) => {
//   // Retrieve registration data from the request body
//   const { username, email, password } = req.body;

//   try {
//       // Check if a user with the provided email or username already exists
//       const existingUser = await User.findOne({ $or: [{ username }, { email }] });

//       if (existingUser) {
//           // A user with the same email or username already exists
//           return res.status(400).json({ error: 'User already exists' });
//       }

//       // Hash the password asynchronously
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Create a new user with the provided data and hashed password
//       const user = new User({
//           username,
//           email,
//           password: hashedPassword,
//       });

//       // Save the user to the database
//       const savedUser = await user.save();

//       // Handle successful user save
//       console.log('User saved:', savedUser);
//       res.json({ message: 'Registration successful' });
//   } catch (error) {
//       // Handle registration error
//       console.error('Registration error:', error);
//       res.status(500).json({ error: 'Failed to register user' });
//   }
// });

//   // Google Signin route
// app.post("/google-signin", async (request, response) => {
//   const { email, picture } = request.body;

//   try {
//     // Find the user in the database
//     const databaseUser = await User.findOne({ email });

//     if (!databaseUser) {
//       // If the user doesn't exist, create a new user
//       const newUser = new User({
//         email,
//         // profile_picture: picture,
//       });

//       await newUser.save();

//       const payload = {
//         email,
//       };

//       const jwt_token = jwt.sign(payload, "MY_SECRET_TOKEN");
//       response.send({ jwt_token });
//     } else {
//       const payload = {
//         email,
//       };

//       const jwt_token = jwt.sign(payload, "MY_SECRET_TOKEN");
//       response.send({ jwt_token });
//     }
//   } catch (error) {
//     console.error('Google signin error:', error);
//     response.status(500).json({ message: 'Internal server error' });
//   }
// });
// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationCode,
    });

    const savedUser = await user.save();

    sendVerificationEmail(email, verificationCode);

    console.log('User saved:', savedUser);
    res.json({ message: 'Registration successful. Check your email for verification.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/verify', async (req, res) => {
  const { email, verificationCode } = req.body;
  console.log('Request to /verify:', req.body);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationCode === verificationCode) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ message: 'Email verification successful' });
      console.log('Verification successful');

    } else {
      return res.status(401).json({ message: 'Incorrect verification code' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

function sendVerificationEmail(email, code) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ecommerceapp8@gmail.com',
      pass: 'cuesoyfbusquxakg',
    },
  });

  const mailOptions = {
    from: 'ecommerceapp8@gmail.com',
    to: email,
    subject: 'Account Verification',
    text: `Your verification code is: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Login route
app.post('/login', async (req, res) => {
  // Retrieve login credentials from the request body
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    if (!email) {
      return res.status(404).json({ message: 'email not found' });
    }
 // Check if the user is verified before attempting to compare passwords
 if (!user.isVerified) {
  return res.status(401).json({ message: 'User not verified. Check your email for verification.' });
}
    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Password doesn't match
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Password matches, login successful
    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

  // Google Signin route
app.post("/google-signin", async (request, response) => {
  const { email, picture } = request.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new user
      const newUser = new User({
        email,
        // profile_picture: picture,
      });

      await newUser.save();

      const payload = {
        email,
      };

      const jwt_token = jwt.sign(payload, "sdfghjkfdgh");
      response.send({ jwt_token });
    } else {
      const payload = {
        email,
      };

      const jwt_token = jwt.sign(payload, "sdfghjkfdgh");
      response.send({ jwt_token });
    }
  } catch (error) {
    console.error('Google signin error:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
