const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index(req, res) {
        const { latitude, logitude, techs } = req.query

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordenates: [logitude, latitude]
                    },
                    $maxDistance: 10000,
                }
            }
        })

        res.json({ devs })
    }
}