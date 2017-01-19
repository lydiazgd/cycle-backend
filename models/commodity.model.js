var mongoose = require('mongoose'); 
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var saltRounds = require('../config').SALT_WORK_FACTOR;

/**
 *commodityschema
**/
const CommoditySchema = new mongoose.Schema({
  itemsname: {
    type:String,
    required:true,
    index: {
      unique:true
    }
  },
   

  itemdescription: {
    type:String,
    required:true,
    index: {
      unique:true
    }
  },


  publisher: {
    type:String,
    required:true,
  },


  itemfineness: {
    type:String,
    required:true,
  },


  itemprice: {
    type:Number,
    required:true,
  },
   

  publishdate:{
    type:Date,
    default:Date.now(),
  }
});

