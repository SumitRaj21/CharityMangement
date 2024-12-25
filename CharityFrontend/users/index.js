let flag=0;
document.getElementById('profile').addEventListener('click', async function(e) {
    e.preventDefault();
    if(flag==0){
        const token=localStorage.getItem('token');
        const response= await axios.get('http://localhost:8000/api/users/user-profile',{headers:{"Authorization":token}});
        const user=response.data;
      document.getElementById('profile-section').style.display='block';
      const parentNode=document.getElementById("profile-section");
       const childHTML=`<h2>User Profile</h2>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phonenumber}</p>
        <p>Gender:${user.gender}</p>
        <p>Address:${user.address}</p>
        <p>Profession:${user.profession}</p>
        <button onclick="updateUser()">Edit</button>`
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


async function updateUser() {
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
            <label>Gender:</label>
            <label><input type="radio" name="gender" value="Male" required> Male</label>
            <label><input type="radio" name="gender" value="Female" required> Female</label>
            <label><input type="radio" name="gender" value="Others" required> Others</label>
            <label for="address">Address:</label>
            <textarea id="address" name="address" rows="3"  required></textarea>
            <label for="profession">Profession:</label>
            <input type="text" id="profession" name="profession" required>
        <button type="submit">Submit</button>
    </form>`;
}

function update(e){
    e.preventDefault();
    const userDetails={
        name:e.target.name.value,
        email:e.target.email.value,
        phone:e.target.phone.value,
        gender:e.target.gender.value,
        address:e.target.address.value,
        profession:e.target.profession.value,
    }
    const token=localStorage.getItem('token');
    console.log(token);
    console.log(userDetails);
    axios.patch("http://localhost:8000/api/users/update-userProfile",userDetails,{headers:{"Authorization":token}})
    .then((response)=>{
        
        alert(response.data.message);
       location.reload();
        
    }).catch(err=>console.log(err)); 
}

window.addEventListener("DOMContentLoaded",()=>{
    const token=localStorage.getItem('token');
    axios.get('http://localhost:8000/api/users/charities',{headers:{"Authorization":token}})
    .then((response)=>{
        // console.log(response.data);
        response.data.map(charity=>{
                displayCharityOnScreen(charity);
               })
        
    }).catch(err=>console.log(err));
});

function displayCharityOnScreen(charity){
    const parentNode=document.getElementById('approved');
      const childHTML=`<div class="charity-card">
                <h3>${charity.projectName}</h3>
                <p>${charity.goal}</p>
                <button onclick="donationPage(${charity.id})" class="btn">Read More</button>
            </div>`;
       parentNode.innerHTML+=childHTML;
       document.getElementById('city').innerHTML+=`<option value="${charity.city}">${charity.city}</option>`
       document.getElementById('category').innerHTML+=`<option value="${charity.category}">${charity.category}</option>`

}

async function search(e) {
    e.preventDefault();
    const searchDetails={
        projectName:e.target.project_name.value,
        city:e.target.city.value,
        category:e.target.category.value,
    }
    const token=localStorage.getItem('token');
    axios.post("http://localhost:8000/api/users/search-charities",searchDetails,{headers:{"Authorization":token}})
    .then((response)=>{
        console.log(response);
        document.getElementById('approved').innerHTML="";
        response.data.map(charity=>{
            displayCharityOnScreen2(charity);
           })
        
    }).catch(err=>console.log(err));
}

function displayCharityOnScreen2(charity){
    const parentNode=document.getElementById('approved');
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

let flag1=0;
document.getElementById('donations').addEventListener('click', async function(e) {
    e.preventDefault();
    if(flag1==0){
        const token=localStorage.getItem('token');
        const response= await axios.get('http://localhost:8000/api/users/donation-history',{headers:{"Authorization":token}});
        const donations=response.data;
        console.log(donations);
        document.getElementById('donation-history-section').style.display='block';
        donations.map(donation=>{
            displayDonationsOnScreen(donation);
           });
      flag1=1;
    } else{
        document.getElementById('donation-history-section').style.display='none';
        const parentNode=document.getElementById("donation-section");
        const childHTML=``;
               parentNode.innerHTML=childHTML;
        flag1=0;
    }
});
function displayDonationsOnScreen(donation){
        const parentNode=document.getElementById("donation-section");
        const childHTML=`<li>Donated Rs. ${donation.donationAmount} to ${donation.projectName} on ${new Date(donation.updatedAt).toISOString().split('T')[0]} <button onclick="downloadReceipt(${donation.id})" class="downbtn">Download Receipt</button></li>`
              parentNode.innerHTML+=childHTML;
}

async function downloadReceipt(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const response = await axios.get(`http://localhost:8000/api/users/receipt-download/${id}`, {
        headers: { "Authorization": token },
        responseType: 'blob', 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${id}.pdf`); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again.");
    }
  }
  




