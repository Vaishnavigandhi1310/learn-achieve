const express = require('express');
const dotenv = require('dotenv');
const path = require('path');         
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutess');
const packageRoutes = require('./routes/packageRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
connectDB();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/style/upload', express.static(path.join(__dirname, 'upload')));  

app.use('/api/packages', packageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
