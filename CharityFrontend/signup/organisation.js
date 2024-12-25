form.addEventListener('submit', function(event){
    event.preventDefault();
    
    let name=document.querySelector('#name').value;
        let email=document.querySelector('#email').value;
        let password=document.querySelector('#password').value;
        let myobj={
            name:name,
            email:email,
            password:password
        }
axios.post('http://localhost:8000/api/main/organization-signup',myobj)
    .then((response) => {
            alert(response.data.message);
            window.location.href="../organisation/login.html";
    })
    .catch((error) =>{
        alert(error.data.message);
    });
});