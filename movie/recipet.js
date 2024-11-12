const API_KEY = 'e99eb229d9834c86a47a5550141b4811 ';
const recipeGrid = document.getElementById('recipeGrid');
const searchInput = document.getElementById('searchInput');
const recipeModal = document.getElementById('recipeModal');
const recipeDetails = document.getElementById('recipeDetails');
const closeModal = document.getElementById('closeModal');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length > 2) {
        fetchRecipes(query);
    }
});

async function fetchRecipes(query) {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`);
    const data = await response.json();
    displayRecipes(data.results);
}

function displayRecipes(recipes) {
    recipeGrid.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        `;
        recipeCard.addEventListener('click', () => fetchRecipeDetails(recipe.id));
        recipeGrid.appendChild(recipeCard);
    });
}

async function fetchRecipeDetails(id) {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
    const data = await response.json();
    showRecipeDetails(data);
}

function showRecipeDetails(recipe) {
    recipeDetails.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%;">
        <h3>Ingredients</h3>
        <ul>
            ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
        </ul>
        <h3>Instructions</h3>
        <p>${recipe.instructions}</p>
        <h3>Nutrition</h3>
        <p>Calories: ${recipe.nutrition.nutrients.find(n => n.name === 'Calories').amount} kcal</p>
    `;
    recipeModal.style.display = 'flex';
}

closeModal.addEventListener('click', () => {
    recipeModal.style.display = 'none';
});

// Favorites logic with localStorage can be added here.
