var head = document.getElementById("head-txt");
var change = document.getElementById("change-txt");
   

let _isSignIn = "true";
    head.textContent = "SIGN IN";
    change.textContent = "Don't have an account? Sign UP";




if(_isSignIn === "true")   {
    head.textContent = "SIGN IN";
    change.textContent = "Don't have an account? Sign UP";

}   else    {
    head.textContent = "SIGN UP";
    change.textContent = "Already have an account? Sign IN";

}

change.addEventListener("click", function () {
   // console.log("clicked");

    if(_isSignIn == "true")   {
        console.log("sign inn");
        head.textContent = "SIGN UP";
       change.textContent = "Already have an account? Sign IN";
         _isSignIn = "false";
        
    
    } else  {
        console.log("not sign inn");
        head.textContent = "SIGN IN";
    change.textContent = "Don't have an account? Sign UP";
     _isSignIn = "true";
        
    
    }

});




document.getElementById("log_btn").addEventListener("click", function () {


    var email = document.getElementById("email-inp").value;
    var pass = document.getElementById("pass-inp").value;

    if(email=="")   {
        showToast("Enter Email Address !");
    } else if(pass =="")    {
        showToast("Enter Password !")
    } else{
        showToast("Please Wait...");


        if(_isSignIn == 'true') {


            console.log("SIgn innnn");
        
                // Get email and password from the form
                const emaill = email;
                const password = pass;
    
                // Create the payload
                const payload = {
                    email: emaill,
                    password: password
                };
    
                // Send the data to the Flask backend via POST request
                fetch('http://127.0.0.1:5000/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.message) {
                        showToast("Sign In Success!")
                    } else {
                        showToast("Sign In Failed!" + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to connect to server');
                });


        } else  {

            console.log("SIgn upppp");
        
                // Get email and password from the form
                const emaill = email;
                const password = pass;
    
                // Create the payload
                const payload = {
                    email: emaill,
                    password: password
                };
    
                // Send the data to the Flask backend via POST request
                fetch('http://127.0.0.1:5000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.message) {
                        showToast("Sign Up Success!")
                    } else {
                        showToast("Sign Up Failed!" + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to connect to server');
                });
            
    
        }




    }


});





function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent=msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000); // Toast will disappear after 3 seconds
  }