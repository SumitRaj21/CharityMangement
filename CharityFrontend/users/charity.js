window.addEventListener("DOMContentLoaded",()=>{
    const id=localStorage.getItem('charityId');
    const token=localStorage.getItem('token');

    axios.get(`http://localhost:8000/api/users/charityByid/${id}`,{headers:{"Authorization":token}})
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
document.getElementById('donation').addEventListener('click',async function (e){
    e.preventDefault();
    if(flag==0){
    document.getElementById('make-charity').style.display='block';
    const parentNode=document.getElementById("make-charity");
    const childHTML=`<h1>Make 1st Step to Make World better</h1>
    <form onsubmit="payment(event)">
        <label for="donation">Enter Amount:</label>
        <input type="number" id="donation" name="donation" placeholder="Enter amount" required>
        <button type="submit">Pay Amount</button>
    </form>`;
    parentNode.innerHTML+=childHTML;
    flag=1;
    }else{
        document.getElementById('make-charity').style.display='none';
        const parentNode=document.getElementById("make-charity");
        const childHTML=``;
               parentNode.innerHTML=childHTML;
        flag=0;
    }
   
});

async function payment(e) {
    e.preventDefault();
    const charityId=localStorage.getItem('charityId');
    const amountDetails={
        amount:e.target.donation.value,
        charityId:charityId
    }
    const token=localStorage.getItem('token');
    // console.log(token);
    // console.log(amountDetails);
    const response=await axios.post('http://localhost:8000/api/users/payment',amountDetails,{headers:{"Authorization":token}});
    console.log(response);
    var options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:8000/api/users/updatetransaction1',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id
            },{headers:{"Authorization":token}})

            alert("Thank You for Donation");
            location.reload();
        },
    };
    const rzp1= new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function(response){
        console.log(response);
        await axios.post('http://localhost:8000/api/users/updatetransaction0',{
            order_id:options.order_id,
        },{headers:{"Authorization":token}})
        alert("Something went wrong");
        location.reload();
    });

}