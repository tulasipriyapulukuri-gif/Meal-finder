let categoriesContainer = document.getElementById("categories");
let mealList = document.getElementById("mealList");
let mealDetails = document.getElementById("mealDetails");
let resultsContainer = document.getElementById("results");
let searchInput = document.getElementById("searchInput");
let searchTitle = document.getElementById("searchTitle");

let sideMenu = document.getElementById("sideMenu");
let sideList = document.getElementById("sideList");

// Pages
let pageCategories = document.getElementById("page-categories");
let pageMeals = document.getElementById("page-meals");
let pageDetails = document.getElementById("page-details");

// Function → show page
function showPage(page) {
    pageCategories.style.display = "none";
    pageMeals.style.display = "none";
    pageDetails.style.display = "none";
    page.style.display = "block";
}

// Load Categories on Home
async function loadCategories() {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let data = await res.json();

    categoriesContainer.innerHTML = data.categories
        .map(
            (cat) => `
        <div class="category-card" onclick="openCategory('${cat.strCategory}')">
            <img src="${cat.strCategoryThumb}">
            <div class="tag">${cat.strCategory}</div>
        </div>
    `
        )
        .join("");

    // Also fill slide menu   ⭐ FIXED
    sideList.innerHTML = data.categories
        .map(
            (cat) => `
            <div onclick="openCategory('${cat.strCategory}')">${cat.strCategory}</div>
        `
        )
        .join("");
}
loadCategories();

// Open Category
async function openCategory(catName) {
    searchTitle.style.display = "none";
    resultsContainer.innerHTML = "";

    showPage(pageMeals);

    // Fetch category description
    let catRes = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let catData = await catRes.json();
    let category = catData.categories.find((c) => c.strCategory === catName);

    document.getElementById("mealCategoryTitle").innerHTML = `
        <h2>${catName}</h2>
        <div class="category-description-box">
            <h3>${category.strCategory}</h3>
            <p>${category.strCategoryDescription}</p>
        </div>
    `;

    // Fetch meals
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`);
    let data = await res.json();

    mealList.innerHTML = data.meals
        .map(
            (meal) => `
        <div class="meal-card" onclick="openMeal(${meal.idMeal})">
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
        </div>
    `
        )
        .join("");
}

// OPEN MEAL
async function openMeal(id) {
    showPage(pageDetails);

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let data = await res.json();
    let meal = data.meals[0];

    mealDetails.innerHTML = `
        <div class="meal-details-container">

            <div class="meal-img-box">
                <img src="${meal.strMealThumb}">
            </div>

            <div class="meal-info-box">
                <h2>${meal.strMeal}</h2>

                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Area:</strong> ${meal.strArea}</p>
                <p><strong>Tags:</strong> ${meal.strTags || "No Tags"}</p>

                <h3>Ingredients</h3>
                <ul class="ingredients-list">
                    ${getIngredients(meal)}
                </ul>
            </div>

        </div>

        <div class="instructions-box">
            <h3>Instructions</h3>
            <p>${meal.strInstructions.replace(/\r?\n/g, "<br><br>")}</p>
        </div>
    `;
}

// INGREDIENTS FUNCTION ⭐ FIXED
function getIngredients(meal) {
    let list = "";

    for (let i = 1; i <= 20; i++) {
        let ing = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];

        if (ing && ing.trim() !== "") {
            list += `<li>${ing} — ${measure}</li>`;
        }
    }
    return list;
}

// Search Meals
searchInput.addEventListener("keyup", async () => {
    let value = searchInput.value.trim();

    if (value.length === 0) {
        resultsContainer.innerHTML = "";
        searchTitle.style.display = "none";
        return;
    }

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
    let data = await res.json();

    if (!data.meals) {
        resultsContainer.innerHTML = "<p>No meals found</p>";
        searchTitle.style.display = "block";
        return;
    }

    searchTitle.style.display = "block";

    resultsContainer.innerHTML = data.meals
        .map(
            (meal) => `
        <div class="meal-card" onclick="openMeal(${meal.idMeal})">
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
        </div>
    `
        )
        .join("");
});

// Hamburger Open
document.getElementById("hamburger").onclick = () => {
    sideMenu.classList.add("open");
};

// Close Sidebar
document.getElementById("closeMenu").onclick = () => {
    sideMenu.classList.remove("open");
};

// Home Click
document.getElementById("homeLink").onclick = () => {
    showPage(pageCategories);
    searchTitle.style.display = "none";
    resultsContainer.innerHTML = "";
};
