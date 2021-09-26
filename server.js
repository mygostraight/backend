const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();
const api =
  'sk_test_51JNw7IFaOz6Tn6IJLxj2Dcsk1YSCsD1L7GJhiPzmcRLgd7MKDvCSNz5x1FRxPsFUEAuuK3uk7xPFZrgNFQ1QEuep002IRRZaoB';
const stripe = require('stripe')(api);
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);

app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  file.mv(`${__dirname}/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

// Payment Endpoint
app.post('/payment', cors(), async (req, res) => {
  let { amount, id } = req.body;
  try {
    await stripe.paymentIntents.create({
      amount,
      currency: 'SEK',
      description: 'Fawad Rashid',
      payment_method: id,
      confirm: true,
    });
    res.json({
      message: 'Payment successful',
      success: true,
    });
  } catch (error) {
    console.log('Error', error);
    res.json({
      message: 'Payment failed',
      success: false,
    });
  }
});

app.get('/', (req, res) => {
  res.send('working');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
