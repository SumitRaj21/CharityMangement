form.addEventListener('submit', function(event){
    event.preventDefault();
        let username=document.querySelector('#username').value;
        let password=document.querySelector('#password').value;
        let myobj={
            username:username,
            password:password
        }
axios.post('http://localhost:8000/api/admin/admin-login',myobj)
    .then((response) => {
            alert(response.data.message);
            // localStorage.setItem('token',response.data.token);
            window.location.href="./index.html";
    })
    .catch((error) =>{
        console.log(error);
        document.body.innerHTML+=`<div style="color:red">${error.message}</div>`
    });
});