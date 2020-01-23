const axios = require('axios');
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body

        let dev = await Dev.findOne({ github_username })

        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
            let { name = login, avatar_url, bio } = response.data;


            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            const techsArray = parseStringAsArray(techs);

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
        }

        return res.json(dev)
    },
    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs)
    },
    async update(req, res) {
        const dev = await Dev.findOne({ github_username: req.params.github_username })

        let { name = dev.name, avatar_url = dev.avatar_url, bio = dev.bio, techs = dev.techs } = req.body

        if (!Array.isArray(techs))
            techs = parseStringAsArray(techs)

        const response = await Dev.updateOne({ github_username: req.params.github_username }, { name, avatar_url, bio, techs })
        return res.json(response)
    }
}