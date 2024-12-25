window.addEventListener("DOMContentLoaded",()=>{
    const id=localStorage.getItem('charityId');
    const token=localStorage.getItem('token');

    axios.get(`http://localhost:8000/api/organization/charityByid/${id}`,{headers:{"Authorization":token}})
    .then((response)=>{
        console.log(response.data);
                displayCharityOnScreen(response.data);
    }).catch(err=>console.log(err));
});

function displayCharityOnScreen(charity){
    if(charity.approvalStatus=='approved'){
        // document.getElementById('impact').style="display:inline";
        document.getElementById('status').innerText='Approval Status:Approved';
    }else if(charity.approvalStatus=='pending'){
        document.getElementById('status').innerText='Approval Status:Pending';
    }else{
        document.getElementById('status').innerText='Approval Status:Rejected';
    }
   document.getElementById('project_name').innerText=`${charity.projectName}`;
   document.getElementById('organization_name').innerText=`${charity.organizationName}`;
   document.getElementById('city').innerText=`${charity.city}`;
   document.getElementById('category').innerText=`Category: ${charity.category}`;
   document.getElementById('goal').innerText=`Goal:\n ${charity.goal}`;
   document.getElementById('project_overview').innerText=`Project Overview:\n${charity.projectOverview}`;
   document.getElementById('donation_goal').innerText=`Donation Goal: ${charity.donationGoal}`;
};


let flag=0;
document.getElementById('edit').addEventListener('click',async function (e){
    e.preventDefault();
    if(flag==0){
    document.getElementById('edit-charity').style.display='block';
    const parentNode=document.getElementById("edit-charity");
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
    flag=1;
    }else{
        document.getElementById('edit-charity').style.display='none';
        const parentNode=document.getElementById("edit-charity");
        const childHTML=``;
               parentNode.innerHTML=childHTML;
        flag=0;
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
    const id=localStorage.getItem('charityId');
    const token=localStorage.getItem('token');
    axios.post(`http://localhost:8000/api/organization/edit-charity/${id}`,charityDetails,{headers:{"Authorization":token}})
    .then((response)=>{
        alert(response.data.message);
       window.location.href="./index.html";
        
    }).catch(err=>console.log(err)); 

}