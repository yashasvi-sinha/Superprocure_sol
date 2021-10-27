require('dotenv').config()
const {connect, disconnect} = require('mongoose');
const BranchModel = require('./models/Branch')
const UserModel = require('./models/User')
const generatePass = require('password-generator')

const csv=require('csvtojson');

const csvFilePath='BeetleNut_Data.csv'
async function importData() {
    const jsonArray = await csv({ignoreEmpty: true }).fromFile(csvFilePath)

    const branchUserArray = []
    
    const formattedBranches = jsonArray.map((branchData, index) => {
        
        const branchUser = new UserModel({
            fullName: branchData["Branch Incharge"],
            userName: `user-${branchData["Branch Name"].replace(' ', '-')}`,
            password: generatePass()
        })

        branchUserArray.push(branchUser)
        
        return {
            institutionName: branchData["Insitution Name"],
            branchName: branchData["Branch Name"],
            address: branchData["Address"],
            city: branchData["City"],
            branchIncharge: branchUser,
            contactNumber: branchData["Contact Number"],
            pincodeCovered: branchData["Pincode covered"],
        }
    })

    await connect(process.env.DB_URL)

    const userDeletedResult = await UserModel.deleteMany()
    console.log(`🚀 ~ importData ~ userDeletedResult`, userDeletedResult.deletedCount)

    const userInsertedResult = await UserModel.insertMany(branchUserArray)
    console.log(`🚀 ~ importData ~ userInsertedResult`, userInsertedResult.length)
    

    const deleteResult = await BranchModel.deleteMany()
    console.log(`🚀 ~ importData ~ deleteResult`, deleteResult.deletedCount)

    const insertedResult = await BranchModel.insertMany(formattedBranches)
    console.log(`🚀 ~ importData ~ insertedResult`, insertedResult.length)


    //add an admin account
    const adminUser = new UserModel({
        fullName: 'Admin',
        userName: `user-admin`,
        password: generatePass()
    })

    const adminInsertedResult = await UserModel.create(adminUser)
    console.log(`🚀 ~ importData ~ adminInsertedResult`, adminInsertedResult)


    await disconnect()
    
}

importData()