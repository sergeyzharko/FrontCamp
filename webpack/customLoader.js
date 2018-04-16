module.exports = source => {
    const jsonObject = JSON.parse(source);
    for (let index of jsonObject) {
        for(let prop in index){
            if ( !isNaN(Number(prop))) {
                jsonObject.splice(jsonObject.indexOf(prop)-1, 1);
            }
        }
    }
    return JSON.stringify(jsonObject);
};