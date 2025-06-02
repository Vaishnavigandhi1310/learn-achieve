const express = require('express');
const dotenv = require('dotenv');
const path = require('path');         
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutess');
const packageRoutes = require('./routes/packageRoutes');
const cartRoutes = require('./routes/cartRoutes');

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

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
