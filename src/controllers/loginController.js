const User =  require('../models/user');
const db = require('../models/index');
const connection = require('../config/connectDB');
const { where} = require('sequelize');
const functionLogin = require('../services/loginService');
const otp_generator = require('otp-generator');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const { name } = require('ejs');

let getLogin = (req,res) => {
    return res.render('login');
};
let getSignup = (req,res) => {
    return res.render('signUp');
};

let sendOtp = async (req,res) => {
    try{
        const accSid = process.env.Twilio_Account_SID;
        const accToken = process.env.Twilio_Account_Token;
        const accPhonenumber = process.env.Twilio_phonenumber;
        const twilioClient = new twilio.Twilio(accSid,accToken);
        const otp = otp_generator.generate(4,{upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false});
        await twilioClient.messages.create({
            body: `Mã OTP của bạn là: ${otp}`,
            to: '+840868019902',
            from: accPhonenumber
        });
        return res.status(200).json({success: true, message: otp});
    }catch(error){
        console.log('Lỗi khi gửi mã OTP!', error);
        return res.status(500).json({message: error.message });
    }
};
let addUser = async (req,res) => {
    const {phoneNumber,username,password} = req.body;
    // console.log(req.body);
    try{
        if(phoneNumber==="" || username==="" || password===""){
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Vui lòng điền đầy đủ thông tin!'});
        }
        let isphoneNumberExist = await functionLogin.checkPhoneExist(phoneNumber);
        let isphoneNumber = await functionLogin.checkPhoneNumber(phoneNumber);
        
        if(password.length < 8 || !isphoneNumber){
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Vui lòng điền chính xác thông tin!' });
        }
        if (isphoneNumberExist) {
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Số điện thoại đã được sử dụng!' });
        }
        
        let newPass = await functionLogin.hashPassword(password);
        const newUser = await db.User.create({phoneNumber,username,password:newPass});
        return res.status(200).json({ status: 200, title: 'Success', message: 'Đăng ký thành công!', data: newUser }); 
    }catch(error){
        console.log('Lỗi khi tạo tài khoản!', error);
        return res.status(500).json({ status: 500, title: 'Error', message: 'Đã có lỗi xảy ra khi tạo tài khoản!' });
    }
};
let checkLogin = async (req,res) => {
    const {phoneNumber, password} = req.body;
    const username = await functionLogin.getUserName(phoneNumber);
    const user = {phone: phoneNumber, name: username};
    try{
        if (phoneNumber === "" || password === "") {
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Vui lòng điền đầy đủ thông tin!' });
        }
        let isUserExist = await functionLogin.checkUser(phoneNumber,password);
        if(!isUserExist){
            return res.status(400).json({ status: 400, title: 'Warning', message: 'Số điện thoại hoặc mật khẩu không chính xác!'});
        }
        const accessToken = await functionLogin.genAccsesToken(user);
        const refreshToken = await functionLogin.genRefreshToken(user);
        return res.status(200).json({ status: 200, title: 'Success', message: 'Đăng nhập thành công!', user,accessToken,refreshToken});
    }catch(error){
        console.log('Lỗi khi đăng nhập!', error);
        return res.status(500).json({ status: 500, title: 'Error',message: 'Đã có lỗi xảy ra khi đăng nhập!' });
    }
};
// Middleware để xác thực access token
let authenToken = async (req,res,next) =>{
    const authHeader = req.headers['authorization']; // Dạng Bearer Token
    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).json({message:'Không có token!'});
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err) return res.status(403).json({message: `Token không hợp lệ! ${err}`});
        req.user = user;
        // console.log(err,user);
        next();
    })

};
let user = async (req,res) =>{
    return res.json(req.user);
}
module.exports = {
    getSignup,getLogin,
    addUser,sendOtp,checkLogin,
    authenToken,user
}