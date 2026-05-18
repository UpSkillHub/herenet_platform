const express = require('express');
const router = express.Router();
const axios = require('axios');

// Verify payment with Flutterwave
router.post('/verify-payment', async (req, res) => {
  const { transaction_id } = req.body;
  
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
        }
      }
    );
    
    if (response.data.status === 'success' && response.data.data.status === 'successful') {
      res.json({ 
        success: true, 
        transaction: response.data.data,
        amount: response.data.data.amount,
        currency: response.data.data.currency
      });
    } else {
      res.json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

module.exports = router;