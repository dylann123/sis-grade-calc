let tab

function openSIS(){
    tab = window.open("https://sisstudent.fcps.edu/SVUE/PXP2_Gradebook.aspx?AGU=0&studentGU=891B5993-0618-4E1D-8DF7-5A168E953E10", "_blank")
    
}

document.getElementById("open_sis").addEventListener("click", () => {
    openSIS()
})

document.getElementById("inject_script").addEventListener("click", () => {
    alert("tried to inject...")
    try {
        var element = tab.document.createElement('script');
        element.type='text/javascript';
        element.innerHTML = 'fetch("https://raw.githubusercontent.com/dylann123/sis-grade-calc/main/gui-script.js").then((res)=>{return res.text()}).then((data)=>{alert(data)})'
        tab.document.body.appendChild(element)
    } catch (e) {
        alert(e)
    }
})