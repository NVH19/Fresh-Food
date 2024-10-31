const express = require('express');
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');
let router = express.Router();
let userRoute = (app) => {
    router.get('/signUp', loginController.getSignup);
    router.get('/login', loginController.getLogin);
    router.get('/', homeController.getHome);
    router.get('/user', loginController.authenToken, loginController.user);
    router.get('/categories', homeController.Categories);
    router.get('/newProducts', homeController.newProducts);

    router.post('/sendOtp', loginController.sendOtp);
    router.post('/addUser', loginController.addUser);
    router.post('/checkLogin',loginController.checkLogin);
    router.post('/logout',homeController.logout);

    return app.use('/',router);
}
module.exports = userRoute;