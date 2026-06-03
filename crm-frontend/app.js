async function login() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value



    const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email,
        password
    })





})

const data =  await res.json()
console.log(data)

localStorage.setItem("token", data.token)
}


async function getLeads() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/leads", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    console.log(data);
}
