const axios = require('axios');

const KHALTI_URL = 'https://a.khalti.com/api/v2/epayment';
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;


async function initiatePayment(details) {
    try {
        console.log('Initiating Khalti Payment with details:', details);
        const config = {
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        };

        const payload = {
            return_url: details.return_url,
            website_url: details.website_url,
            amount: details.amount, // Amount in paisa
            purchase_order_id: details.purchase_order_id,
            purchase_order_name: details.purchase_order_name,
            customer_info: details.customer_info,
        };
        console.log('Khalti API Payload:', payload);

        const response = await axios.post(`${KHALTI_URL}/initiate/`, payload, config);
        return response.data;
    } catch (error) {
        console.error('Khalti Initiate Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to initiate payment');
    }
}


async function verifyPayment(pidx) {
    try {
        const config = {
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        };

        const payload = { pidx };

        const response = await axios.post(`${KHALTI_URL}/lookup/`, payload, config);
        return response.data;
    } catch (error) {
        console.error('Khalti Verify Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to verify payment');
    }
}

module.exports = {
    initiatePayment,
    verifyPayment,
};
