const express = require('express');
const router = express.Router();
const registration = require('../models/user');
const registraionFrom = registration.User;
const SendOtp = require('sendotp');
const Nexmo = require('nexmo');
var otpGenerator = require('otp-generator')

// mobile generate otp keys
const nexmo = new Nexmo({
    apiKey: '85740c1a',
    apiSecret: 'SGGlIFYHaVxLZ1X5',
});

/*    >>>>>>>>>>>>>>>>>>>>>>> REGISTRATION  API  FOR SIGNUP  >>>>>>>>>>>>>>>>>>>>>   */
router.post("/registration", (req, res) => {
    try {
        registraionFrom.findOne({ toNumber: req.body.toNumber }, async (err, user) => {
            var phonetoValidate = req.body.toNumber;
            var phonePattern = /^[0-9]\d{2}[0-9]\d{2}\d{4}$/;
            if (phonePattern.test(phonetoValidate)) {
                if (err) res.status(401).json({ statusCode: 401, message: 'something went wrong......' });
                if (user) res.status(400).json({ statusCode: 400, message: 'your are alredy registered this phone.......' })
                var body = req.body;
                let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
                const from = '917409291597'
                const to = '91' + req.body.toNumber
                const text = 'this is the otp =========>' + otp
                console.log(from, to , text)
                nexmo.message.sendSms(
                    from, to, text,
                    (err, responseData) => {

                        if (err) {
                            console.log(err);
                        } else {
                            console.dir(responseData);
                        }
                    }
                );
                var data = {
                    toNumber: body.toNumber,
                    otp: otp
                }
                var myData = await new registraionFrom(data);
                myData.save().then(item => {
                    res.status(200).json({ statusCode: 200, message: 'item saved to the database', result: item })
                })
                    .catch(err => {
                        res.status(400).json({ statusCode: 400, message: 'unable send to the data', error: err });
                    });
            }
            else {
                res.status(500).json({ statusCode: 500, message: 'wrong phone??????????????', error: err })
            }
        })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


// router.post('/send', (req, res) => {

//     console.log('hello bhai' , req.body)
//     // Send SMS
//     nexmo.message.sendSms(
//       '917409291597', req.body.toNumber, req.body.message, {type: 'unicode'},
//       (err, responseData) => {if (responseData) {console.log(responseData)}}
//     );
//   });

module.exports = router;