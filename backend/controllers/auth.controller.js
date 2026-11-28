
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const register = async (req, res) => {
  try {
    const { username, password,  } = req.body;
       const requestedRole = req.body.role || 'user';
    // Validate input
    if (!username || !password ) {
      return res.status(400).json({
        error: 'Username and password & role are required',
      });
    }

    const cleanUsername = String(username).trim();

    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      return res.status(400).json({
        error: 'Username must be between 3 and 50 characters',
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        error: 'Password must contain at least 8 characters',
      });
    }

    // Check duplicate username
    const existingUser = await User.findByUsername(cleanUsername);

    if (existingUser) {
      return res.status(409).json({
        error: 'Username already exists',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Public registration always creates a normal user.
    // Never accept admin role from req.body.
    const user = await User.create(
      cleanUsername,
      passwordHash,
      requestedRole
    );

    return res.status(201).json({
      message: 'Registration successful',
      user,
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err);

    // MySQL duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Username already exists',
      });
    }

    return res.status(500).json({
      error: 'Registration failed',
      details: err.message,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required',
      });
    }

    const cleanUsername = String(username).trim();

    const user = await User.findByUsername(cleanUsername);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid username or password',
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid username or password',
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
      },
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);

    return res.status(500).json({
      error: 'Login failed',
      details: err.message,
    });
  }
};
