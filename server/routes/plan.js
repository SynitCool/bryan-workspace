const express = require('express')
const router = express.Router()
const Plan = require('../model/Plan')

async function getAllPlan() {
    try {
        const plans = await Plan.find()
        return plans
    } catch (err) {
        throw Error(err.message)
    }
}

router.get('/', (req, res) => {
    getAllPlan().then(plans => res.json(plans)).catch(err => res.status(500).json({ message: err.message }))
})

router.delete('/delete/:id', (req, res) => {
    Plan.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: `Plan ${req.params.id} deleted` }))
        .catch(err => res.status(500).json({ message: err.message }))
})

router.post('/add', (req, res) => {
    const newPlan = new Plan(req.body)
    newPlan.save()
        .then(() => res.json({ message: 'Plan added' }))
        .catch(err => res.status(500).json({ message: err.message }))
})

router.put('/update/:id', (req, res) => {
    Plan.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json({ message: `Plan ${req.params.id} updated` }))
        .catch(err => res.status(500).json({ message: err.message }))
    }
)

module.exports = router