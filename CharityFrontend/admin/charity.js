window.addEventListener("DOMContentLoaded",()=>{
    const id=localStorage.getItem('charityId');
    axios.get(`http://localhost:8000/api/admin/charityByid/${id}`)
    .then((response)=>{
        console.log(response.data);
                displayCharityOnScreen(response.data);
    }).catch(err=>console.log(err));
});

function displayCharityOnScreen(charity){
    document.getElementById('project_name').innerText=`${charity.projectName}`;
    document.getElementById('organization_name').innerText=`${charity.organizationName}`;
    document.getElementById('city').innerText=`${charity.city}`;
    document.getElementById('category').innerText=`Category: ${charity.category}`;
    document.getElementById('goal').innerText=`Goal:\n ${charity.goal}`;
    document.getElementById('project_overview').innerText=`Project Overview:\n${charity.projectOverview}`;
    document.getElementById('donation_goal').innerText=`Donation Goal: ${charity.donationGoal}`;
 };

 let flag=0;
document.getElementById('approval').addEventListener('click',async function (e){
    e.preventDefault();
    if(flag==0){
    document.getElementById('approve-charity').style.display='block';
    const parentNode=document.getElementById("approve-charity");
    const childHTML=`
   <form onsubmit="Approval(event)">
    <label for="approval">
      <button type="submit" name="approval" value="approved">Approve</button>
      <button type="submit" name="approval" value="rejected">Reject</button>
    </label>
  </form>`;
    parentNode.innerHTML+=childHTML;
    flag=1;
    }else{
        document.getElementById('approve-charity').style.display='none';
        const parentNode=document.getElementById("approve-charity");
        const childHTML=``;
               parentNode.innerHTML=childHTML;
        flag=0;
    }
   
});

 function Approval(e) {
    e.preventDefault();
    const charityId=localStorage.getItem('charityId');
    const obj={
        approvalStatus: e.submitter.value,
        charityId:charityId
    }
    console.log(obj);
     axios.post('http://localhost:8000/api/admin/charitystatus',obj).then((response)=>{
        alert(response.message);
        window.location.href="./index.html";
     }).catch(err=>console.log(err));
}