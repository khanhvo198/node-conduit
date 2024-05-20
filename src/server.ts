import app from './app';
import mongoose from 'mongoose';
import 'dotenv/config';

const DB =
  process.env.DATABASE?.replace(
    '<password>',
    process.env.DATABASE_PASSWORD || ''
  ) || '';

mongoose.connect(DB).then(() => {
  console.log('Successfully ');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Hello from Mystic server ${PORT}`);
});
