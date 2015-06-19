var mongoose = require('mongoose');
var lightRed =  ["rgba(255,0,0,0.5)", "rgba(255,0,0,0.6)", "rgba(255,0,0,0.7)", "rgba(220,220,220,0.7)"];
var darkRed =  ["rgba(255,0,0,0.8)", "rgba(255,0,0,0.8)", "rgba(255,0,0,0.9)", "rgba(220,220,220,1)"];
var orange = ["rgba(255, 165, 0, 0.5)", "rgba(255, 165, 0, 0.8)", "rgba(255, 165, 0, 0.75)", "rgba(255, 165, 0, 1)"];
var yellow =  ["rgba(255, 255, 0,0.5)", "rgba(255, 255, 0,0.8)", "rgba(255, 255, 0,0.75)", "rgba(255, 255, 0,1)"];
var green = ["rgba(0,255,0,0.5)", "rgba(0,255,0,0.8)", "rgba(0,255,0,0.75)", "rgba(0,255,0,1)"];
var SchemaColors = mongoose.Schema();
module.exports = {
   creditNoCredit: {
      minCredit: {
         type: Number,
         min: 0,
         max: 100,
         default: 60,
         select: true,
         required: true
      },
      colorCredit: {
         type: String,
         //match: /rgba\(\d+,\d+,\d+,\d+\)|rgba\([01]?\.?\d*,[01]?\.?\d*,[01]?\.?\d*,[01]?\.?\d*\)/
      },
      colorNoCredit: {
         type: String,
         //match: /rgba\(\d+,\d+,\d+,\d+\)|rgba\(\d?\.?\d*,\d?\.?\d*,\d?\.?\d*,[01]?\.?\d*\)/
      }
   },
   letterGrade: {
      minA: {
         type: Number,
         min: 0,
         max: 100,
         default: 90,
         required: true,
         select: true
      },
      minB: {
         type: Number,
         min: 0,
         max: 100,
         default: 80,
         required: true,
         select: true
      },
      minC: {
         type: Number,
         min: 0,
         max: 100,
         default: 70,
         required: true,
         select: true
      },
      minD: {
         type: Number,
         min: 0,
         max: 100,
         default: 60,
         required: true,
         select: true
      },
      aColor: {
         '0': String,
         '1': String,
         '2': String,
         '3': String
      },
      bColor: {
         '0': String,
         '1': String,
         '2': String,
         '3': String
      },
      cColor: {
         '0': String,
         '1': String,
         '2': String,
         '3': String
      },
      dColor: {
         '0': String,
         '1': String,
         '2': String,
         '3': String
      },
      fColor: {
         '0': String,
         '1': String,
         '2': String,
         '3': String
      }
   },
   preSave: function (next) {
      if (this.aColor.length == 0){
         this.aColor = green;
      }
      if (this.bColor.length == 0) {
         this.bColor = yellow;
      }
      if (this.cColor.length == 0) {
         this.cColor = orange;
      }
      if (this.dColor.length == 0) {
         this.dColor = lightRed;
      }
      if (this.fColor.length == 0) {
         this.fColor = darkRed;
      }



      if (this.minB > this.minA) {
         next('Invalid minimum score for B. The score must not be larger than A.');
      }
      else if (this.minC > this.minB) {
         next('Invalid minimum score for C. The score must not be larger than B.');
      }
      else if (this.minD > this.minC) {
         next('Invalid minimum score for D. The score must not be larger than C.');
      }
      else {
         next();
      }
   }
};