require('dotenv').config()
const {connect} = require('mongoose');
const BranchModel = require('./models/Branch')

const csv=require('csvtojson')

const csvFilePath='BeetleNut_Data.csv'
async function importData() {
    const jsonArray = await csv({ignoreEmpty: true }).fromFile(csvFilePath)
    
    const formattedBranches = jsonArray.map(branchData => {
        return {
            institutionName: branchData["Insitution Name"],
            branchName: branchData["Branch Name"],
            address: branchData["Address"],
            city: branchData["City"],
            contactNumber: branchData["Contact Number"],
            pincodeCovered: branchData["Pincode covered"],
        }
    })

    await connect(process.env.DB_URL)

    const deleteResult = await BranchModel.deleteMany()
    console.log(`🚀 ~ importData ~ deleteResult`, deleteResult)

    const insertedResult = await BranchModel.insertMany(formattedBranches)
    console.log(`🚀 ~ importData ~ insertedResult`, insertedResult)
    
}

importData()