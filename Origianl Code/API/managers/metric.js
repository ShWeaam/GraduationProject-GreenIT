const Metric = require('../models/metric');
const uuid = require('uuid').v4;
const moment = require('moment');
const mongoose = require("mongoose");

const Manager = {
    // get metrics for all users within same city
    getByCity: async (city, date) => {
        const startOfMonth = moment(date).startOf('month');
        const endOfMonth   = moment(date).endOf('month');
        let metrics = await Metric.aggregate([
            {
                $lookup: {
                    from: `users`,
                    localField: `userId`,
                    foreignField: `_id`,
                    as: `userId`
                }
            },
            {
                $match: {
                    $and: [
                        {"userId.city": {$regex: city, $options: 'i'}},
                        {date: {
                            $gte: new Date(startOfMonth),
                            $lt: new Date(endOfMonth)
                        }}
                    ]
                }
            }
        ]).unwind('userId');

        // console.log(metrics);
        return metrics;
        // let t = [];
        // metrics.forEach(m => {
        //    let f = metrics.filter(x => x.userId._id.toString() === m.userId._id.toString()).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        //    if(!t.find(k => k.userId._id.toString() === f.userId._id.toString())) {
        //        t.push(f);
        //    }
        // });
        // return t;
    },

    // get metrics for all users
    getAllForCompare: async (metric, userIds, date) => {
        const startOf6Months = moment(date).add(-6, 'month').startOf('month');
        const endOfMonth6Months   = moment(date).endOf('month');

        let metrics = await Metric.aggregate([
            {
                $lookup: {
                    from: `users`,
                    localField: `userId`,
                    foreignField: `_id`,
                    as: `userId`
                }
            },
            {
                $match: {
                    date: {
                        $gte: new Date(startOf6Months),
                        $lt: new Date(endOfMonth6Months)
                    }
                }
            }
        ]).unwind('userId');

        let t = [];
        metrics.forEach(m => {
            let f = metrics.filter(x => x.userId._id.toString() === m.userId._id.toString()).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            if(!t.find(k => k.userId._id.toString() === f.userId._id.toString())) {
                t.push(f);
            }
        });

        let f = [];
        for(let i = 0; i < userIds.length; i++) {
            let current = userIds[i];
            let currentUserMetrics = metrics.filter(k => k.userId._id.toString() === current.toString());
            if(currentUserMetrics.length === 0) continue;
            currentUserMetrics = currentUserMetrics.sort((a, b) => (a, b) => new Date(b.date) - new Date(a.date));
            let currentMonthMetrics = currentUserMetrics[0];
            let previousMonthMetrics = currentUserMetrics[1];
            let name = currentMonthMetrics && currentMonthMetrics.userId.name || ``;
            let avg = 0;
            let curr = 0;
            let prev = 0;
            switch (metric) {
                case 'Water':
                    avg = currentUserMetrics.reduce((acc, curr) => acc+curr.water, 0) / currentUserMetrics.length;
                    curr = currentMonthMetrics && currentMonthMetrics.water || 0;
                    prev = previousMonthMetrics && previousMonthMetrics.water || 0;
                    break;
                case 'Electricity':
                    avg = currentUserMetrics.reduce((acc, curr) => acc+curr.electricity, 0) / currentUserMetrics.length;
                    curr = currentMonthMetrics && currentMonthMetrics.electricity || 0;
                    prev = previousMonthMetrics && previousMonthMetrics.electricity || 0;
                    break;
                case 'Gas':
                    avg = currentUserMetrics.reduce((acc, curr) => acc+curr.gas, 0) / currentUserMetrics.length;
                    curr = currentMonthMetrics && currentMonthMetrics.gas || 0;
                    prev = previousMonthMetrics && previousMonthMetrics.gas || 0;
                    break;
                case 'Paper':
                    avg = currentUserMetrics.reduce((acc, curr) => acc+curr.paper, 0) / currentUserMetrics.length;
                    curr = currentMonthMetrics && currentMonthMetrics.paper || 0;
                    prev = previousMonthMetrics && previousMonthMetrics.paper || 0;
                    break;
                case 'Disposables':
                    avg = currentUserMetrics.reduce((acc, curr) => acc+curr.disposables, 0) / currentUserMetrics.length;
                    curr = currentMonthMetrics && currentMonthMetrics.disposables || 0;
                    prev = previousMonthMetrics && previousMonthMetrics.disposables || 0;
                    break;
            }

            f.push({
                userId: current,
                name: name,
                current: curr,
                previous: prev,
                average: avg
            });
        }

        return f;
    },

    // get the average for last 6 months
    getAverage: async userId => {
        const startOf6Months = moment().add(-6, 'month').startOf('month');
        const endOfMonth6Months   = moment().endOf('month');
        let metrics = await Metric.aggregate([
            {
                $lookup: {
                    from: `users`,
                    localField: `userId`,
                    foreignField: `_id`,
                    as: `userId`
                }
            },
            {
                $match: {
                    date: {
                        $gte: new Date(startOf6Months),
                        $lt: new Date(endOfMonth6Months)
                    }
                }
            }
        ]).unwind('userId');

        metrics = metrics.filter(k => k.userId._id.toString() === userId.toString());

        let result = {
            avgWater: metrics.reduce((acc, curr) => acc+curr.water, 0) / metrics.length || 0,
            avgElectricity: metrics.reduce((acc, curr) => acc+curr.electricity, 0) / metrics.length || 0,
            avgGas: metrics.reduce((acc, curr) => acc+curr.gas, 0) / metrics.length || 0,
            avgPaper: metrics.reduce((acc, curr) => acc+curr.paper, 0) / metrics.length || 0,
            avgDisposables: metrics.reduce((acc, curr) => acc+curr.disposables, 0) / metrics.length || 0,
        };

        return result;
    },
    check: async (userId, date) => {
        const startOfMonth = moment(date).startOf('month');
        const endOfMonth   = moment(date).endOf('month');
        let metrics = await Metric.aggregate([
            {
                $lookup: {
                    from: `users`,
                    localField: `userId`,
                    foreignField: `_id`,
                    as: `userId`
                }
            },
            {
                $match: {
                    date: {
                        $gte: new Date(startOfMonth),
                        $lt: new Date(endOfMonth)
                    }
                }
            }
        ]).unwind('userId');

        metrics = metrics.filter(k => k.userId._id.toString() === userId.toString());

        let result = { status: metrics.length !== 0 };

        return result;
    },
    getById: async id => {
        const t = await Metric.findById(id);
        return t ? t : false;
    },
    getByUserId: async userId => {
        const t = await Metric.find({userId: userId}).populate('userId');
        return t ? t : false;
    },
    getByUserIdWithMonth: async (userId, date) => {
        const startOfMonth = moment(date).startOf('month');
        const endOfMonthMonth = moment(date).endOf('month');
        let metrics = await Metric.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) }},
            {
                $lookup: {
                    from: `users`,
                    localField: `userId`,
                    foreignField: `_id`,
                    as: `userId`
                }
            },
            {
                $match: {
                    date: {
                        $gte: new Date(startOfMonth),
                        $lt: new Date(endOfMonthMonth)
                    }
                }
            }
        ]).unwind('userId');
        return metrics;
    },
    create: async t => {
        let user = new Metric({...t});
        user = await user.save();
        return user ? user : false;
    },
    update: async (id, data) => {
        let t = await Metric.findByIdAndUpdate(id, {
            water: data.water,
            electricity: data.electricity,
            gas: data.gas,
            paper: data.paper,
            disposables: data.disposables
        }, {
            new: true
        });

        return t ? t : false;
    },
    delete: async id => {
        let t = await Metric.findByIdAndDelete(id);
        return t ? true : false;
    },
    deleteAll: async () => {
        let t = await Metric.deleteMany({});
        return t ? true : false;
    }
};

module.exports = Manager;