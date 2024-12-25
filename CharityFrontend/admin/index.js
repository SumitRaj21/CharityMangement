window.addEventListener("DOMContentLoaded",()=>{
    axios.get('http://localhost:8000/api/admin/charities')
    .then((response)=>{
        console.log(response.data);
        response.data.map(charity=>{
                displayCharityOnScreen(charity);
               })
        
    }).catch(err=>console.log(err));
});

function displayCharityOnScreen(charity){
    const parentNode=document.getElementById('pending');
      const childHTML=`<div class="charity-card">
                <h3>${charity.projectName}</h3>
                <p>${charity.goal}</p>
                <button onclick="donationPage(${charity.id})" class="btn">Read More</button>
            </div>`;
       parentNode.innerHTML+=childHTML;
      
}

function donationPage(id){
    localStorage.setItem('charityId',id);
    window.location.href="./charity.html";
}