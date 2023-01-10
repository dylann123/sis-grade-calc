let dataElement = document.getElementById("ctl00_CategoryWeights")
let dataParsed = JSON.parse(dataElement.getAttribute("data-data-source"))
let pointsData = {}
let currentGrade = 0
function parseData(){
    for(let i in dataParsed){
        console.log("Found category "+dataParsed[i]["Category"])
        pointsData[dataParsed[i]["Category"]] = {}
        pointsData[dataParsed[i]["Category"]] = {
            currentPoints: dataParsed[i].TotalPoints,
            maxPoints: dataParsed[i].TotalPossible,
            pctOfGrade: dataParsed[i]["PctOfGrade"]
        }
    }
}

function calculateGrade(){
    currentGrade = 0
    for(let i in pointsData){
        if(i == "TOTAL") break
        let percentOfGrade = 0
        if(pointsData[i].maxPoints != 0){
            percentOfGrade = (pointsData[i].currentPoints/pointsData[i].maxPoints)*pointsData[i].pctOfGrade
            currentGrade += parseFloat(percentOfGrade.toFixed(2))
        }else{
            percentOfGrade = parseFloat(pointsData[i].pctOfGrade)
            currentGrade += percentOfGrade
        }
    }
    currentGrade = parseFloat(currentGrade).toFixed(2)
}
function addGrade(category,gainedPoints,maxPoints){
    if(pointsData[category] == undefined) {
        console.log(`Invalid category ${category}.`)
        return
    }else{
        pointsData[category].currentPoints += gainedPoints
        pointsData[category].maxPoints += maxPoints
    }
    calculateGrade()
    console.log("If you add "+gainedPoints+"/"+maxPoints+" to your "+category+" grade, you get a "+currentGrade+"%")
}
function reset(){
    parseData()
    calculateGrade()
    console.log(`You have a ${currentGrade}% in this class`)
}
reset()
console.log("Successfully loaded SIS grade calculator")
