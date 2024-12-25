let flag=0;
document.getElementById('profile').addEventListener('click', async function(e) {
    e.preventDefault();
    if(flag==0){
        const token=localStorage.getItem('token');
        console.log(token);
        const response= await axios.get('http://localhost:8000/api/organization/organization-profile',{headers:{"Authorization":token}});
        const organization=response.data;
        console.log(response.data);
      document.getElementById('profile-section').style.display='block';
      const parentNode=document.getElementById("profile-section");
       const childHTML=`<h2>Organization Profile</h2>
        <p>Name: ${organization.name}</p>
        <p>Email: ${organization.email}</p>
        <p>Phone: ${organization.phonenumber}</p>
        <p>Address:${organization.address}</p>
        <p>Category:${organization.category}</p>
        <button onclick="updateOrganization()">Edit</button>`
              parentNode.innerHTML+=childHTML;
      flag=1;
    } else{
        document.getElementById('profile-section').style.display='none';
        const parentNode=document.getElementById("profile-section");
        const childHTML=``;
               parentNode.innerHTML=childHTML;
        flag=0;
    }
});

async function updateOrganization() {
    console.log("i am clicked");
    const parentNode=document.getElementById("profile-section");
    parentNode.innerHTML=``;
    parentNode.innerHTML=`<form onsubmit="update(event)">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="phone">Phone:</label>
            <input type="tel" id="phone" name="phone" required>
            <label for="address">Address:</label>
            <textarea id="address" name="address" rows="3"  required></textarea>
            <label for="category">Category:</label>
            <input type="text" id="category" name="category" required>
        <button type="submit">Submit</button>
    </form>`;
}

function update(e){
    e.preventDefault();
    const organizationDetails={
        name:e.target.name.value,
        email:e.target.email.value,
        phonenumber:e.target.phone.value,
        address:e.target.address.value,
        category:e.target.category.value,
    }
    const token=localStorage.getItem('token');
    // console.log(token);
    // console.log(organizationDetails);
    axios.patch("http://localhost:8000/api/organization/update-organizationProfile",organizationDetails,{headers:{"Authorization":token}})
    .then((response)=>{
        alert(response.data.message);
       location.reload();
        
    }).catch(err=>console.log(err)); 
}
let flag2=0;
document.getElementById('charity').addEventListener('click',async function (e){
    e.preventDefault();
    if(flag2==0){
    document.getElementById('create-charity').style.display='block';
    const parentNode=document.getElementById("create-charity");
    const childHTML=`<h1>Submit Your Charity Proposal</h1>
    <form onsubmit="createCharity(event)">
        <label for="projectName">Project Name:</label>
        <input type="text" id="projectName" name="projectName" placeholder="Enter project name" required>
        <label for="city">City:</label>
        <input type="text" id="city" name="city" placeholder="Enter city" required>
        <label for="category">Category:</label>
        <select id="category" name="category" required>
            <option value="" disabled selected>Select category</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="environment">Environment</option>
            <option value="technology">Childcare</option>
            <option value="other">Other</option>
        </select>
        <label for="projectOverview">Project Overview:</label>
        <textarea id="projectOverview" name="projectOverview" placeholder="Provide a brief overview of the project" rows="5" required></textarea>
        <label for="goal">Goal:</label>
        <textarea id="goal" name="goal" placeholder="What is the goal of this project?" rows="3" required></textarea>
        <label for="donationGoal">Donation Goal:</label>
        <input type="number" id="donationGoal" name="donationGoal" placeholder="Enter donation goal amount" min="1" required>
        <button type="submit">Submit Project</button>
    </form>`;
    parentNode.innerHTML+=childHTML;
    flag2=1;
    }else{
        document.getElementById('create-charity').style.display='none';
        const parentNode=document.getElementById("create-charity");
        const childHTML=``;
               parentNode.innerHTML=childHTML;
        flag2=0;
    }
   
});

function createCharity(e){
    e.preventDefault();
    const charityDetails={
        project_name:e.target.projectName.value,
        city:e.target.city.value,
        category:e.target.category.value,
        project_overview:e.target.projectOverview.value,
        goal:e.target.goal.value,
        donation_goal:e.target.donationGoal.value,
    }
    const token=localStorage.getItem('token');
    // console.log(token);
    // console.log(charityDetails);
    axios.post("http://localhost:8000/api/organization/create-charity",charityDetails,{headers:{"Authorization":token}})
    .then((response)=>{
        alert(response.data.message);
       location.reload();
        
    }).catch(err=>console.log(err)); 

}

window.addEventListener("DOMContentLoaded",()=>{
    const token=localStorage.getItem('token');
    axios.get('http://localhost:8000/api/organization/charities',{headers:{"Authorization":token}})
    .then((response)=>{
        console.log(response.data);
        response.data.map(charity=>{
                displayCharityOnScreen(charity);
               })
        
    }).catch(err=>console.log(err));
});

function displayCharityOnScreen(charity){
    if(charity.approvalStatus=="approved"){
      const parentNode=document.getElementById('approved');
      const childHTML=`<div class="charity-card">
                <h3>${charity.projectName}</h3>
                <p>${charity.goal}</p>
                <button onclick="donationPage(${charity.id})">Read More</button>
            </div>`;
       parentNode.innerHTML+=childHTML;     

    }else if(charity.approvalStatus=="pending"){
        const parentNode=document.getElementById('pending');
        const childHTML=`<div class="charity-card">
                  <h3>${charity.projectName}</h3>
                  <p>${charity.goal}</p>
                  <button onclick="donationPage(${charity.id})">Read More</button>
              </div>`;
         parentNode.innerHTML+=childHTML;     
    }else{
        const parentNode=document.getElementById('rejected');
        const childHTML=`<div class="charity-card">
                  <h3>${charity.projectName}</h3>
                  <p>${charity.goal}</p>
                 <button onclick="donationPage(${charity.id})">Read More</button>
              </div>`;
         parentNode.innerHTML+=childHTML;     
    }
}
function donationPage(id){
    localStorage.setItem('charityId',id);
    window.location.href="./charity.html";
}