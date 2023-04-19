var express = require('express');
const {getPaymentEndPoint} = require("../helps/wallet.help");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/create-order', async function (req, res, next) {
    let dataSend = {
        order_id: '1',
        amount: 100,
        currency: "USDT",
        redirect_url: `http://localhost/abcd`,
        description: "FIRST ORDER",//: "Detail of booking",
        expire_time: 30,
        order_link: `http://localhost/abcd`,
        lang: "en",
    };
    const resultGetLink = await getPaymentEndPoint(dataSend);
    console.log("resultGetLink", resultGetLink)
});

module.exports = router;
