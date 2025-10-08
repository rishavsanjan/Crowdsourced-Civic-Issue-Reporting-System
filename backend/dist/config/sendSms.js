"use strict";
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);
// const sendSms = async(body) => {
//     let msgOptions = {
//         from:"+1(276) 500-0756",
//         to:"+917051901216",
//         body
//     }
//     try {
//         const msg = await client.messages.create(msgOptions);
//         console.log(msg)
//     } catch (error) {
//             console.log(error)
//     }
// };
// sendSms('hello from app')
const sendSms = async () => {
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    try {
        const message = await client.messages.create({
            body: `Your verification code is ${OTP}`,
            messagingServiceSid: "MGc32bd6eb432459172852c6e93b77a461", // ✅ Correct property
            to: "+917051901216"
        });
        console.log("OTP sent successfully:", message.sid, ` ${OTP}`);
    }
    catch (error) {
        console.log("Error sending OTP:", error);
    }
};
sendSms();
