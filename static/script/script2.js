// Parse URL parameters
const params = new URLSearchParams(window.location.search);
const language = params.get("language");
const foodTime = params.get("time");
const type = params.get("foodType");
const foodIngredients = params.get("foodIngrediants");
var currentTimestamp = Date.now();

// OR alternatively:
var idd = new Date().getTime();

let saveContent = '';

var result_div = document.getElementById("result");
var anim_div = document.getElementById("for-anim");
const resultDiv = document.getElementById('result-in');

result_div.style.display = "none";
anim_div.style.display = "flex";

const md = window.markdownit();



console.log("Language:", language);
console.log("Food Time:", foodTime);
console.log("Type:", type);
console.log("Food Ingredients:", foodIngredients);


function speakText(text) {
  if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
  } else {
      alert('Sorry, your browser does not support text-to-speech.');
  }
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
  }
}


function showErrorAndGoBack() {
    // Show the error message to the user
    alert("An error occurred, going back...");

    // Redirect the user back to the previous page or to a specific URL
    window.history.back();  // This will navigate the user back to the previous page
}

// Use these variables as needed

setTimeout(async () => {
    try {
      const response = await fetch("/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          foodTime,
          type,
          foodIngredients,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        result_div.style.display = "flex";
        anim_div.style.display = "none";
        const htmlContent = md.render(result.recipe) + "<p style='font-size: 12px;'><em>Generated by Chef AI</em></p>";
        document.getElementById("result-in").innerHTML = htmlContent;
        saveContent = htmlContent;
        

   
        
       // resultDiv.innerHTML = marked("# hello");
        console.log(result.recipe);
      } else {
        console.log(result.error);
        showErrorAndGoBack("An error occurred: " + result.error);
        
      }
    } catch (error) {
        console.log(error.message);
        showErrorAndGoBack("An error occurred: " + error.message);
    }
  }, 1500); // Delay of 1500ms = 1.5 seconds



  document.getElementById("menu-div").addEventListener('click', function() {
    // Show the save favourite dialog box
    document.getElementById('save-fav-dialog').style.display = 'flex';
});

// Cancel button in the dialog
document.getElementById('cancel-fav-btn').addEventListener('click', function() {
    // Hide the dialog when the user clicks cancel
    document.getElementById('save-fav-dialog').style.display = 'none';
});

// Save button in the dialog
document.getElementById('save-fav-btn').addEventListener('click', function() {
    const title = document.getElementById('fav-title').value;
    if (!title) {
        alert('Please enter a title!');
        return;
    }

    // Replace with the actual content you want to save

    // Send the data to the Flask server using a POST request
    fetch('/save_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idd,
            htmlContent: saveContent,
            title: title // Include the title here
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        
        // Show the toast notification
        const toast = document.getElementById('toast-message');
        toast.textContent = "Added to Favourite!";
        toast.classList.add('show');
        
        // Hide the dialog
        document.getElementById('save-fav-dialog').style.display = 'none';

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    })
    .catch((error) => {
        console.error('Error:', error);
        const toast = document.getElementById('toast-message');
        toast.textContent = "Error adding to favourite!";
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000); // Toast will disappear after 3 seconds
    });
});








  function showToast(msg) {
    const toast = document.getElementById('toast-message');
    toast.textContent=msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000); // Toast will disappear after 3 seconds
  }