const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'shophub-development-secret';

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { rate: { type: Number, default: 4.5 }, count: { type: Number, default: 0 } }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

const createToken = (user) => jwt.sign(
  { id: user._id.toString(), role: user.role, name: user.name, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  next();
};

app.get('/api/health', (req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'offline' }));

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with that email already exists.' });
    const user = await User.create({ name, email: normalizedEmail, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch {
    res.status(500).json({ message: 'Unable to create your account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch {
    res.status(500).json({ message: 'Unable to sign in right now.' });
  }
});

app.get('/api/products', async (req, res) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); }
  catch { res.status(500).json({ message: 'Unable to load products.' }); }
});

app.post('/api/products', authenticate, adminOnly, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, rating: { rate: 5, count: 0 } });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Unable to create product.' });
  }
});

app.delete('/api/products/:id', authenticate, adminOnly, async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Product deleted.' }); }
  catch { res.status(404).json({ message: 'Product not found.' }); }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shophub')
  .then(async () => {
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        await User.create({ name: 'ShopHub Admin', email: adminEmail, password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: 'admin' });
        console.log(`Admin account created for ${adminEmail}`);
      } else if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
      }
    }
    app.listen(PORT, () => console.log(`ShopHub API running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    console.error('Start MongoDB or set MONGO_URI, then run npm run server again.');
  });