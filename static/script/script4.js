var foodName = document.getElementById("ingrediants-inp");

foodName.value = "";

document.getElementById("btn-gnrt").addEventListener('click', async (event) => {

    if(foodName.value != "")   {

        var language = "Malayalam";
        
        var foodnamee = foodName.value;
        console.log("Generating2...");

        // Encode values and redirect
    const query = new URLSearchParams({
        language,
        foodnamee,
    }).toString();

    window.location.href = `/generated2?${query}`

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