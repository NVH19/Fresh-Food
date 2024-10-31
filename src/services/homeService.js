const db = require('../models/index');
const connection = require('../config/connectDB');
const { where } = require('sequelize');

const getCategory = async () => {
    let categories = await db.Categories.findAll();
    if(!categories) return null;
    return categories;
}
const getNewProducts = async() =>{
    let newFruits = await db.Products.findAll({
        where: {title: "Fresh Fruits"}
    });
    return newFruits.slice(-12);
}
module.exports = {
    getCategory,getNewProducts
}