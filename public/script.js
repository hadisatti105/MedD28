document.getElementById("leadForm").addEventListener("submit", async function(e){

e.preventDefault()

const phone = document.getElementById("phone").value
const state = document.getElementById("state").value
const zip = document.getElementById("zip").value

const res = await fetch("/submit", {

method: "POST",
headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
phone,
state,
zip
})

})

const data = await res.json()

document.getElementById("result").innerHTML =
"<pre>" + JSON.stringify(data, null, 2) + "</pre>"

})