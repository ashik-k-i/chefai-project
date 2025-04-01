function fetchFavourites() {
    fetch('/get_favourites')
        .then(response => response.json())
        .then(data => {
            const favouritesList = document.getElementById('favourites-list');
            favouritesList.innerHTML = ''; // Clear any existing content

            // Check if there are no favourites
            if (Object.keys(data).length === 0) {
                favouritesList.innerHTML = '<p>Favourites is empty</p>';
                return;  // Exit early if no favourites
            }

            // Iterate over the saved favourites and render them
            for (const [id, favourite] of Object.entries(data)) {
                const favouriteItem = document.createElement('div');
                favouriteItem.classList.add('favourite-item');
            
                const title = favourite.title || '';  
                const htmlContent = favourite.htmlContent || '';  
            
                const encodedTitle = encodeURIComponent(title); // Escape title
                const encodedHtmlContent = encodeURIComponent(htmlContent); // Escape htmlContent
            
                favouriteItem.innerHTML = `
                    <div>
                        <h3>${title}</h3>
                    </div>
                    <button data-title="${encodedTitle}" data-html-content="${encodedHtmlContent}" onclick="goToFavouritePage(this)">View Details</button>
                    <button onclick="deleteFavourite('${id}')">Delete</button> <!-- Delete button -->
                `;
            
                favouritesList.appendChild(favouriteItem);
            }
            
            
        })
        .catch((error) => {
            console.error('Error fetching favourites:', error);
        });
}

// Function to delete a favourite
function deleteFavourite(id) {
    if (confirm('Are you sure you want to delete this favourite?')) {
        fetch(`/delete_favourite/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log("Delete response:", data);
            if (data.status === "success") {
                fetchFavourites(); // Refresh the UI
            } else {
                alert(data.message); // Show error message
            }
        })
        .catch((error) => {
            console.error('Error deleting favourite:', error);
        });
    }
}



// Function to remove a favourite (for example, from the in-memory storage or database)
function removeFavourite(id) {
    // Send a request to remove the favourite (you can add a backend route to handle this)
    fetch('/remove_favourite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Favourite removed:', data);
        fetchFavourites(); // Refresh the list
    })
    .catch((error) => {
        console.error('Error removing favourite:', error);
    });
}
fetchFavourites();
console.log("workingg");


function goToFavouritePage(button) {
    const title = decodeURIComponent(button.getAttribute('data-title'));
    const htmlContent = decodeURIComponent(button.getAttribute('data-html-content'));

    // Store them in localStorage (or you can send them to the server if needed)
    localStorage.setItem('favouriteTitle', title);
    localStorage.setItem('favouriteHtmlContent', htmlContent);

    // Redirect to the favourite details page
    window.location.href = '/favourite_details';
}

