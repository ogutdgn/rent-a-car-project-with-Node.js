"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Car Controller:

const Car = require('../models/car')

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "List Cars"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(Car)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Car),
            data
        })
    },

    // CRUD:

    create: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Create Car"
        */

        const data = await Car.create({
            ...req.body,
            //! while creating the car we give the createdId and the updatedId from the req.userid
            createdId: req.user.id,
            updatedId: req.user.id
        })

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Get Single Car"
        */

        const data = await Car.findOne({ _id: req.params.id }).populate("createdId")

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Update Car"
        */
        
        // console.log(req.file) // upload.sinle()
        // console.log(req.files) // upload.array() || upload.any()

        // Mevcut Car resimlerini getir:
        // const Car = await Car.findOne({ _id: req.params.id }, { _id: 0, createdId })

        // Car.images
        // for (let file of req.files) {
        //     // Mevcut Car resimlerine ekle:
        //     // Car.images.push(file.filename)
        //     Car.images.push('/uploads/' + file.filename)
        // }
        // // Car resimlerini req.body'ye aktar:
        // req.body.images = Car.images
        // console.log(req.body);

        // const Car = await Car.findOne({ _id: req.params.id }, { _id: 0, createdId })

        const data = await Car.updateOne(
            { _id: req.params.id }, 
            {
                ...req.body,
                updatedId: req.user.id //! when a staff or admin updates the cars information updatedId changes with the current req.user.id
            }, 
            { runValidators: true }
            )
        // const data = await Car.updateOne(
        //     { _id: req.params.id },
        //     { ...req.body, images: [...Car.images] },
        //     { runValidators: true }
        //   );

        res.status(202).send({
            error: false,
            data,
            new: await Car.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Delete Car"
        */

        const data = await Car.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    }
}