if (document.getElementById("ctl00_CategoryWeights") != null) {
	if (document.getElementById("studentvue-calc") != null)
		document.getElementById("studentvue-calc").remove()
	loaded = true
	let dataElement = document.getElementById("ctl00_CategoryWeights")
	let dataParsed = JSON.parse(dataElement.getAttribute("data-data-source"))
	let pointsData = {}
	let currentGrade = 0
	function loadGrades() {
		for (let i in dataParsed) {
			console.log("Found category " + dataParsed[i]["Category"])
			pointsData[dataParsed[i]["Category"]] = {}
			pointsData[dataParsed[i]["Category"]] = {
				currentPoints: dataParsed[i].TotalPoints,
				maxPoints: dataParsed[i].TotalPossible,
				pctOfGrade: dataParsed[i]["PctOfGrade"]
			}
		}
	}

	function calculateGrade() {
		currentGrade = 0
		for (let i in pointsData) {
			if (i == "TOTAL") break
			let percentOfGrade = 0
			if (pointsData[i].maxPoints != 0) {
				percentOfGrade = (pointsData[i].currentPoints / pointsData[i].maxPoints) * pointsData[i].pctOfGrade
				currentGrade += parseFloat(percentOfGrade)
			} else {
				percentOfGrade = parseFloat(pointsData[i].pctOfGrade)
				currentGrade += percentOfGrade
			}
		}
		currentGrade = parseFloat(currentGrade).toFixed(3)
	}

	function reset() {
		loadGrades()
		calculateGrade()
		console.log(`You have a ${currentGrade}% in this class`)
	}

	reset()
	console.log("Successfully loaded SIS grade calculator")
	console.log(pointsData)

	let oldGrade = currentGrade
	let container = document.createElement("div")
	container.id = "studentvue-calc"
	container.style.width = "300px"
	container.style.height = "310px"
	container.style.border = "1px black solid"
	container.style.position = "fixed"
	container.style.zIndex = "99"
	container.style.backgroundColor = "white"
	container.style.right = "20px"
	container.style.top = "20px"
	container.style.padding = "5px"
    container.style.opacity = 0.5
	container.innerHTML = `<b>Grade Calculator</b>
	<br>
	Current Grade: ${oldGrade}%
	<br>
	Modded Grade: <span id="pct-disp">${currentGrade}%</span>
	<br>
	Points: <span id="points-disp">${dataParsed[dataParsed.length - 1]["TotalPoints"]}/${dataParsed[dataParsed.length - 1]["TotalPossible"]}</span>
	<br>
	`

    container.addEventListener('mouseenter', () => {
        container.style.opacity = 1
    })
    container.addEventListener('mouseleave', () => {
        container.style.opacity = 0.5
    })


	let calculateGradeButton = document.createElement("button")
	calculateGradeButton.innerText = "Calculate"
	calculateGradeButton.style.position = "fixed"
	calculateGradeButton.style.top = container.style.height.replace("px", "") - 12 + "px"
	calculateGradeButton.style.right = container.style.width.replace("px", "") - 60 + "px"
	calculateGradeButton.addEventListener('click', () => {
		reset()
		for(let i of document.getElementsByClassName("addgrade-line")){
			let earnedPoints = i.getElementsByClassName("earned-points")[0].value
			let totalPoints = i.getElementsByClassName("total-points")[0].value
			let type = i.getElementsByClassName("type-dropdown")[0].value
			if(earnedPoints == "" || totalPoints == "" || type == "") continue
			if(type == "TOTAL") continue
			pointsData[type].currentPoints += parseFloat(earnedPoints)
			pointsData[type].maxPoints += parseFloat(totalPoints)
		}
		pointsData["TOTAL"].currentPoints = 0
		pointsData["TOTAL"].maxPoints = 0
		for(let i in pointsData){
			if(i == "TOTAL") continue
			pointsData["TOTAL"].currentPoints += pointsData[i].currentPoints
			pointsData["TOTAL"].maxPoints += pointsData[i].maxPoints
		}
		calculateGrade()
		document.getElementById("pct-disp").innerText = currentGrade + "%"
		document.getElementById("points-disp").innerText = pointsData["TOTAL"].currentPoints + "/" + pointsData["TOTAL"].maxPoints
	})
	container.appendChild(calculateGradeButton)

	let plusButton = document.createElement("button")
	plusButton.innerText = "+"
	plusButton.id = "plusbutton"
	let count = 0
	plusButton.addEventListener('click', () => {
		count++
		plusButton.remove()
		if(count >= 6)
			plusButton.disabled = true
		let addGradeLine = document.createElement("div")
		addGradeLine.className = "addgrade-line"
		addGradeLine.style.width = container.style.width.replace("px", "") - 15 + "px"
		addGradeLine.style.height = "30px"
		addGradeLine.style.paddingTop = "2px"
		addGradeLine.style.paddingLeft = "5px"
		addGradeLine.style.backgroundColor = (count % 2 == 0) ? "#e6e6e6" : "#f2f2f2"

		let pointsAdd = document.createElement("input")
		pointsAdd.className = "earned-points"
        pointsAdd.placeholder = "Earned"
		pointsAdd.style.width = "40px"
		pointsAdd.style.height = "25px"
		pointsAdd.style.margin = "0px"
		addGradeLine.appendChild(pointsAdd)

		let slash = document.createElement("span")
		slash.innerText = ' / '
		addGradeLine.appendChild(slash)

		let pointsTotal = document.createElement("input")
		pointsTotal.className = "total-points"
        pointsTotal.placeholder = "Total"
		pointsTotal.style.width = "40px"
		pointsTotal.style.height = "25px"
		pointsTotal.style.margin = "0px"
		addGradeLine.appendChild(pointsTotal)

		let typeDropdown = document.createElement("select")
		typeDropdown.className = "type-dropdown"
		typeDropdown.style.height = "25px"
		for(let i of dataParsed){
			if(i["Category"] == "TOTAL") break
			let option = document.createElement("option")
			option.innerText = i["Category"]
			typeDropdown.appendChild(option)
		}
		addGradeLine.appendChild(typeDropdown)

		let removeLineButton = document.createElement("button")
		removeLineButton.innerText = "-"
		removeLineButton.style.position = "fixed"
		removeLineButton.style.right = "35px"
		removeLineButton.addEventListener('click', ()=>{
			addGradeLine.remove();
			plusButton.disabled = false
			count--
		})
		
		addGradeLine.appendChild(removeLineButton)
		container.appendChild(addGradeLine)
		container.appendChild(plusButton)
	})
	container.appendChild(plusButton)

	document.body.appendChild(container)

} else {
	if (window.location.href.indexOf("Gradebook.aspx") > -1)
		console.log("Open a class to view grade calculator")
	else
		console.log("Open the GradeBook")
	loaded = false
}
