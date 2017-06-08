var Sequelize = require('sequelize');
var msg = {
    field: {
        title: {
            type: Sequelize.STRING,
            defaultValue: '',
            allowNull: false
        },
        type:{
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            defaultValue: '',
            allowNull: false
        },
        photo: {
            type: Sequelize.STRING,
            defaultValue: '',
            allowNull: false
        }
    }
};
var user = {
    field: {
        account: {
            type: Sequelize.STRING,
            defaultValue: '',
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            defaultValue: '',
            allowNull: false
        },
        type:{
            type: Sequelize.INTEGER,
            defaultValue:0,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            defaultValue: '',
            allowNull: false
        }
    },
    api:{
        list:{
            queryConfig:{
                order:[['id','DESC']],
                where:{type:0}
            }
        }
    },
}

var dictionary = {
    field:{
        code:{
            type:Sequelize.INTEGER,
            defaultValue:0,
            allowNull:false
        },
        name:{
            type:Sequelize.STRING,
            defaultValue:'',
            allowNull:false
        },
        value:{
            type:Sequelize.STRING,
            defaultValue:'',
            allowNull:false
        },
        description:{
            type:Sequelize.STRING,
            defaultValue:'',
            allowNull:false
        }
    }
}
module.exports = {
    model: {
        user:user,
        msg:msg,
        dictionary:dictionary
    },
    relation: function () {

    }
}