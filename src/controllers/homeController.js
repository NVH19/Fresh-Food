const funtionHome = require('../services/homeService');
let getHome = (req,res) => {
    return res.render('home');
};
let getFruitPage = (req,res) => {
    return res.render('fruit');
};
let logout = (req,res) =>{
    console.log('ok');
    localStorage.removeItem('accessToken', data.accessToken);
    localStorage.removeItem('refreshToken', data.refreshToken);
    return res.render('home');
}
let Categories = async (req,res) =>{
    try{
        const categories_list = await funtionHome.getCategory();
        return res.json(categories_list);
    }catch(error){
        console.log('Lỗi!', error);
        return res.json({status: 500, message: "Đã có lỗi xảy ra"});
    }
}
let newProducts = async (req,res) => {
    try{
        const newFruits = await funtionHome.getNewProducts();
        return res.json(newFruits);
    }catch(e){
        return res.json({message: e})
    }
}
module.exports = {
    getHome,getFruitPage,
    logout,
    Categories,newProducts
}