News key: f53b56a81c57478689c3058487c41269
Запуск babel: babel script.js --out-file script-compiled.js
Запуск webpack: npm run dev / npm run build

5. MongoDB-1

mongoimport --db frontcamp --collection restaurants --file ~/Документы/DEV/FrontCamp/restaurants.json
mongo
use frontcamp

    3.1. db.restaurants.find({borough: "Queens", cuisine: "Chinese"}).count() // 728
    3.2. db.restaurants.aggregate([{ $unwind:"$grades"}, {$sort: {"_id": -1, "grades.score": -1}}, {"$group": {"_id": "$_id", "score": {"$first": "$grades.score"}}}, {$sort: {"score": -1}}, {$limit: 1}, {"$group": {"_id": "$_id"}}])
    3.3. db.restaurants.updateMany({borough: "Manhattan"}, { $push: { grades: { date: ISODate(), grade: "A", score: 7 } } })
    3.4. db.restaurants.find({ "grades.8.score" : { $lt: 7 } }, { name: 1, _id: 0 })
    3.5.
        db.restaurants.aggregate([
            { $unwind:"$grades"},
            { $match: {
                        $and: [
                            { "grades.date": {$gte: ISODate("2014-02-01T00:00:00")}},
                            { "grades.date": {$lt: ISODate("2014-03-01T00:00:00")}},
                            { "grades.grade": {$eq: "B"}}
                            ]
                        }
            },
            {"$project": { "borough": 1 }}
        ])
    4.1.
        db.restaurants.createIndex({ name: 1 })
        db.restaurants.explain().find({ name: "Glorious Food" })
    4.2. db.restaurants.dropIndexes()
    4.3. 
        db.restaurants.createIndex({ restaurant_id: 1 })
        db.restaurants.explain().find({ restaurant_id: "41098650" }, { _id: 0, borough: 1 })
    4.4.
        db.restaurants.createIndex({ cuisine: 1 }, { partialFilterExpression: { borough: { $eq: "Staten Island" } }})
        db.restaurants.explain().find({ borough: "Staten Island", cuisine: "American" })
        db.restaurants.explain().find({ borough: "Staten Island", name: "Bagel Land" })
        db.restaurants.explain().find({ borough: "Queens", cuisine: "Pizza" })
    4.5.
        db.restaurants.createIndex({ "grades.score": 1, "name": 1 }, { partialFilterExpression: { "grades.score": { $lt: 7 } }})
        db.restaurants.explain().find({ "grades.8.score" : { $lt: 7 } }, { name: 1, _id: 0 })

5. MongoDB-2

mongoimport -d frontcamp -c airlines --type csv --headerline --file ~/Документы/DEV/FrontCamp/airlines.csv
mongo
use frontcamp

    1.
db.airlines.aggregate([{
    $group: {
        _id: "$class",
        total: { $sum: 1 }
	}
}])

    2.
db.airlines.aggregate([
    {
        $match: {
            destCountry : {$ne: "United States"}
	    }
    },
    {
        $group: { _id: "$destCity", avgPassengers: { $avg: "$passengers" } }
    },
    {
        $sort: {
            avgPassangers: -1
		}
	},
    {
        $limit: 3
	}
])

    3.
db.airlines.aggregate([
    {
        $match: {
            destCountry : {$eq: "Latvia"}
	    }
    },
    {
        $group: { _id: "$destCountry", carriers: { $push: "$carrier" } }
    }
])

    4.
db.airlines.aggregate([
    {
        $match: {
            originCountry : {$eq: "United States"},
            destCountry : { $in: [ "Greece", "Italy", "Spain" ] }
	    }
    },
    {
        $group: { _id: "$carrier", total: { $sum: "$passengers" } }
    },
    {
        $sort: {
            total: -1
		}
	},
    {
        $limit: 10
	},
    {
        $skip: 3
    }
])

    5.
db.airlines.aggregate([
    {
        $match: {
            originCountry : {$eq: "United States"}
	    }
    },
    {
        $sort: {
            originState: -1
		}
	},
    {
        $group: { totalPassengers: { $sum: "$passengers" }, _id: { state: "$originState", city: "$originCity" } }
    },
    {
        $sort: {
            totalPassengers: -1
		}
	},
    {
        $group: {
            _id: "$_id.state",
            totalPassengers: {$first: "$totalPassengers"},
            state: {$first: "$_id.state"},
            city: {$first: "$_id.city"}
        }
    },
    {
        $sort: {
            "_id.state": 1
		}
	},
    {
        $limit: 5
	},
    { $project : { _id: 0, totalPassengers : 1 , location: { state : "$state", city: "$city" } } }
    ])




mongorestore -d frontcamp -c enron ~/Документы/DEV/FrontCamp/enron/messages.bson

db.enron.aggregate([
    { $unwind: "$headers.To" },
    { "$project": { _id: 0, message: "$headers.Message-ID", from : "$headers.From", to: "$headers.To"  }},
    { $group: {_id: "$message", from: {$first:"$from"}, to: {$first:'$to'} }},
    { $group: {
        _id: { from: "$from", to: "$to" },
        total: { $sum: 1 }
	}},
    {
        $sort: {
            "total": -1
		}
	}
])



6. Node.js - 1

npm install express --save
sudo npm install -g nodemon --save

node app
nodemon app

npm install winston --save
npm install express-error-handler --save
npm install pug --save


7. Node.js - 2

npm install mongodb --save
npm install mongoose --save
npm install passport --save
npm install passport-local --save
npm install ejs --save
npm install nconf --save

sudo service mongod start
nodemon node/app


8. ReactJS

npm i -D webpack webpack-dev-server babel-core babel-loader babel-preset-react react-hot-loader

npm i react react-dom
npm install babel-preset-react