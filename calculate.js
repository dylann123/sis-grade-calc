let dataElement = document.getElementById("ctl00_CategoryWeights")
let dataParsed = JSON.parse(dataElement.getAttribute("data-data-source"))
let pointsData = {}
let currentGrade = 0
function parseData(){
    for(let i in dataParsed){
        pointsData[dataParsed[i]["Category"]] = {}
        pointsData[dataParsed[i]["Category"]] = {
            currentPoints: 0,
            maxPoints: 0,
            pctOfGrade: dataParsed[i]["PctOfGrade"]
        }
    }
    [...document.getElementsByClassName("dx-row dx-data-row dx-column-lines")].forEach(row=>{
        let categoryType = row.children[3].innerHTML
        if(!row.children[7].innerHTML.includes("Points")){
            let earnedpoints = parseFloat(row.children[7].innerHTML.split("/")[0])
            let totalpoints = parseFloat(row.children[7].innerHTML.split("/")[1])
            pointsData[categoryType].currentPoints += earnedpoints
            pointsData[categoryType].maxPoints += totalpoints
        }
    })
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
    console.log(currentGrade)
}
function addGrade(category, gainedPoints, maxPoints){
    if(!pointsData[category]) {
        alert(`Invalid category ${category}.`)
        return
    }else{
        pointsData[category].currentPoints += gainedPoints
        pointsData[category].maxPoints += maxPoints
    }
    calculateGrade()
    console.log(currentGrade)
}
parseData()
calculateGrade()
console.log(`You have a ${currentGrade}% in this class`)
