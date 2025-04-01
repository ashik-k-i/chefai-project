


console.log("working.....");

var textarea1 = document.getElementById("ingrediants-inp");

textarea1.value = "";

var inp_box_div_1 = document.getElementById("inp-box-div-1");
var inp_box_div_2 = document.getElementById("inp-box-div-2");
const dialogOverlay = document.getElementById('dialog-overlay');
const dialogOverlay2 = document.getElementById('dialog-overlay2');
var select_food_type_txt = document.getElementById("select-food-type-txt");
var select_time_txt = document.getElementById("select-time-txt");
const toastMessage = document.getElementById('toast-message');



    let foodType = null;
    let time = null;


    inp_box_div_1.addEventListener('click', () => {
      dialogOverlay.style.display = 'flex';

    });


    inp_box_div_2.addEventListener('click', () => {
        dialogOverlay2.style.display = 'flex';
      });

    dialogOverlay.addEventListener('click', (event) => {
      if (event.target === dialogOverlay) {
        dialogOverlay.style.display = 'none';
      }
    });

    dialogOverlay2.addEventListener('click', (event) => {
        if (event.target === dialogOverlay) {
          dialogOverlay2.style.display = 'none';
        }
      });
  

    

    document.querySelectorAll('#dialog-box #options button').forEach(button => {
      button.addEventListener('click', () => {
        foodType = button.getAttribute('data-value');
        console.log('Food Type : ', foodType);
        dialogOverlay.style.display = 'none';

        select_food_type_txt.textContent = foodType;


      });
    });




    document.querySelectorAll('#dialog-box2 #options2 button').forEach(button => {
        button.addEventListener('click', () => {
          time = button.getAttribute('data-value');
          console.log('Time : ', time);
          dialogOverlay2.style.display = 'none';
  
          select_time_txt.textContent = time;
  
  
        });
      });



var btn_rst = document.getElementById("btn-rst").addEventListener('click', (event) => {
    let foodType = null;
    let time = null;

    select_food_type_txt.textContent = "Select";
    select_time_txt.textContent = "Select";

    textarea1.value = "";


});


var btn_gnrt = document.getElementById("btn-gnrt").addEventListener('click', async (event) => {

    if(foodType != null && time != null && textarea1.value != "")   {

        var language = "Malayalam";
        
        var foodIngrediants = textarea1.value;
        console.log("Generating");

        // Encode values and redirect
    const query = new URLSearchParams({
        language,
        time,
        foodType,
        foodIngrediants,
    }).toString();

    window.location.href = `/generated?${query}`

    /*
        try {
            const response = await fetch("/generate-recipe", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                language,
                time,
                foodType,
                foodIngrediants,
            }),
            });
  
            const result = await response.json();
  
            if (response.ok) {
                console.log(result.recipe);
              
            } else {
                console.log(result.error);
            }
          } catch (error) {
            console.log(error.message);
          }

          */
        


    } else {
        toastMessage.classList.add('show');
      setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000);
    }


});










// Show the dialog box and overlay
document.getElementById('menu-div').addEventListener('click', function() {
  document.getElementById('options-menu').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
});

// Close the dialog when clicking outside the box
document.getElementById('overlay').addEventListener('click', function() {
  closeDialog();
});

// Close the dialog box
function closeDialog() {
  document.getElementById('options-menu').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}
