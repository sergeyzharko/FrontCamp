News key: f53b56a81c57478689c3058487c41269
Запуск babel: babel script.js --out-file script-compiled.js
Запуск webpack: npm run dev / npm run build

5. MongoDB
    3.1. db.restaurants.find({borough: "Queens", cuisine: "Chinese"}).count() // 728
    3.2. db.restaurants.aggregate([{ $unwind:"$grades"}, {$sort: {"_id": -1, "grades.score": -1}}, {"$group": {"_id": "$_id", "score": {"$first": "$grades.score"}}}, {$sort: {"score": -1}}, {$limit: 1}, {"$group": {"_id": "$_id"}}])