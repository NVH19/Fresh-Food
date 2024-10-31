const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const connection = require('../config/connectDB');
const { where } = require('sequelize');
var salt = bcrypt.genSaltSync(10);
const checkPhoneNumber = async (phoneUser) =>{
    // console.log(phoneUser.length, phoneUser[0], isNaN(phoneUser))
    if(phoneUser.length != 10 || phoneUser[0]!='0' || isNaN(phoneUser)){
        return false;
    }
    return true;
}

const checkPhoneExist = async (phoneUser) => {
    let check = await db.User.findOne({
        where: {phoneNumber: phoneUser}
    })
    // console.log(check);
    if(check) return true;
    return false;
}

const hashPassword = async(password) => {
    var hashPass = bcrypt.hashSync(password, salt);
    return hashPass;
}

const checkUser = async(phoneNumberUser,passwordUser) => {
    let user = await db.User.findOne({
        where: {phoneNumber: phoneNumberUser}
    })
    // console.log(user);
    if(!user) return false;
    if (!bcrypt.compareSync(passwordUser,user.password)) return false;
    return true; 
}
const getUserName = async(phoneNumberUser) => {
    let user = await db.User.findOne({
        where: { phoneNumber: phoneNumberUser }
    })
    if (!user) return '';
    return user.username;
}
const genAccsesToken = async(user) => {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
    return accessToken;
}
const genRefreshToken = async(user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '19d' });
    return refreshToken;
}

module.exports = {
    getUserName,
    checkPhoneExist,hashPassword,checkPhoneNumber,checkUser,
    genAccsesToken,genRefreshToken
}