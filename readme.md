News key: f53b56a81c57478689c3058487c41269
Запуск babel: babel script.js --out-file script-compiled.js
Запуск webpack: npm run dev / npm run build

5. MongoDB
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
        db.restaurants.createIndex({ "grades.score": 1 }, { partialFilterExpression: { "grades.score": { $lt: 7 } }})
        db.restaurants.explain().find({ "grades.8.score" : { $lt: 7 } }, { name: 1, _id: 0 })