/**
 * @description Bike model handling bike requests
 */

const data = require('../data/bike.json')
const helpers = require('./helpers.js')
const trips = require('../data/trips.json')

const bike = {
    /**
     * @description Function that returns all bikes
     *
     * @param {Response} res Response object
     * @param {Function} next Next function
     *
     * @returns {void}
     */
    getAllBikes: function getAllBikes(res, next) {
        try {
            return res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    },
    /**
     * @description Function that returns one bike by id
     *
     * @param {number} id Bike id
     * @param {Response} res Response object
     * @param {Function} next Next function
     *
     * @returns {void}
     */
    getOneBike: function getOneBike(id, res, next) {
        try {
            const index = data.findIndex(item => item.id === id);

            if (index === -1) {
                return res.status(404).send('Bike not found');
            }
    
            return res.status(200).json(data[index]);
        } catch (parseErr) {
            next(parseErr)
        }
    },
    /**
     * @description Function that updates a bike
     *
     * @param {Object} bike Bike object
     * @param {Response} res Response object
     * @param {Function} next Next function
     *
     * @returns {Object} Bike object
     */
    updateBike: function updateBike(bike, res, next) {
        const filePath = './data/bike.json'
        const bikeInfo = bike.data

        helpers.addToJsonFile(filePath, bikeInfo, next, bike.id)

        return res.status(201).json({
            id: bike.id,
            cityId: bikeInfo.cityId,
            statusId: bikeInfo.statusId,
            geometry: bikeInfo.geometry
        })
    },
    /**
     * @description Function that rents a bike and starts a trip
     *
     * @param {Object} rent Rent information
     * @param {Response} res Response object
     * @param {Function} next Next function
     *
     * @returns {void}
     */
    rentBike: function rentBike(rent, res, next) {
        const bike = this.getOneBike(rent.bikeId, res, next)
        let filePath = './data/bike.json'

        bike.statusId = "2"
        helpers.addToJsonFile(filePath, bike, next, rent.bikeId)

        const trip = {
            id: trips.length + 1,
            bike_id: rent.bikeId,
            user_id: rent.userId,
            start_time: rent.startTime,
            end_time: "",
            start_pos: rent.startPosition,
            end_pos: "",
            start_cost: "",
            var_cost: "",
            park_cost: ""
        }

        filePath = './data/trip.json'

        helpers.addToJsonFile(filePath, trip, next)
    }
}

module.exports = bike
