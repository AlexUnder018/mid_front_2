
const apiKey = "bb4bce81a58e40d5afa4cf14e20baedf";
const searchBar = document.getElementById('searchBar');
const searchBtn = document.getElementById('searchBtn');
const recipesGrid = document.getElementById('recipesGrid');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sliderMenu = document.getElementById('sliderMenu');

    hamburgerBtn.addEventListener('click', () => {
        sliderMenu.classList.toggle('hidden');
        sliderMenu.classList.toggle('visible');
    });

    document.addEventListener('click', (event) => {
        if (!sliderMenu.contains(event.target) && event.target !== hamburgerBtn) {
            sliderMenu.classList.add('hidden');
            sliderMenu.classList.remove('visible');
        }
    });
});

searchBtn.addEventListener('click', () => {
    const query = searchBar.value.trim();
    if (query) {
        fetchRecipes(query);
    }
});

function fetchRecipes(query) {
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data); // Debug log
            if (data.results && Array.isArray(data.results)) {
                displayRecipes(data.results);
            } else {
                console.error("Invalid response structure or no recipes found");
                recipesGrid.innerHTML = '<p>No recipes found. Try another search!</p>';
            }
        })
        .catch(err => {
            console.error("Error fetching recipes:", err);
            recipesGrid.innerHTML = '<p>Failed to fetch recipes. Please try again later.</p>';
        });
}

function displayRecipes(recipes) {
    if (!recipes || recipes.length === 0) {
        recipesGrid.innerHTML = '<p>No recipes to display. Try searching for something else.</p>';
        return;
    }

    recipesGrid.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            
        `;
        recipeCard.addEventListener('click', () => fetchRecipeDetails(recipe.id));
        recipesGrid.appendChild(recipeCard);
    });
}

function fetchRecipeDetails(id) {
    fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => showRecipeDetails(data))
        .catch(err => console.error(err));
}

function showRecipeDetails(recipe) {
    modal.classList.remove('hidden');
    document.getElementById('recipeTitle').innerText = recipe.title;
    document.getElementById('recipeDesc').innerText = recipe.summary;
    document.getElementById('ingredients').innerHTML = recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('');
    document.getElementById('instructions').innerHTML = recipe.analyzedInstructions[0]?.steps.map(step => `<li>${step.step}</li>`).join('') || '<li>No instructions available</li>';
}

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});

