// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}


//TODO:
//re-implement old code

let postsData = "";
let currentFilters = {
    categories: [],
    level: []
};

const postsContainer = document.getElementById("posts-container");
const categoriesContainer = document.getElementById("post-categories");
const levelsContainer = document.getElementById("post-level");
const postCount = document.getElementById("post-count");
const noResults = document.getElementById("no-posts");


fetch("https://raw.githubusercontent.com/monsoonery/portfolio/main/data.json")
    .then(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        postsData = await response.json();
        postsData.map((post) => createPost(post));
        console.log("posts created");
        console.log(postsData);
        postCount.innerText = postsData.length;

        categoriesData = [
            ...new Set(
                postsData
                    .map((post) => post.categories)
                    .reduce((acc, curVal) => acc.concat(curVal), [])
            )
        ];
        // voor elke categorie een filter knopje maken
        categoriesData.map((category) => createFilter("categories", category, categoriesContainer)
        );
        console.log("category filters (categoriesData) created")
        console.log(categoriesData);

        levelData = [
            ...new Set(
                postsData
                    .map((post) => post.level)
                    .reduce((acc, curVal) => acc.concat(curVal), [])
            )
        ];
        // voor elk overview filter een knopje maken
        levelData.map((level) => createOverview("level", level, levelsContainer)
        );
        console.log("overview filters (levelData) created")
        console.log(levelData);
    });

/* POST CREATION FUNCTION */
const createPost = (postData) => {
    const { title, link, image, status, timeline, categories, level } = postData;
    const post = document.createElement("div");
    post.className = "post";
    post.classList.add("column");
    post.innerHTML = `
      <a class="post-preview" href="${link}">
        <img class="post-image" src="${image}">
      </a>
      <div class="post-content">
        <p class="post-title">${title}</p>
        <div class="post-tags">
          ${categories.map((category) => {return '<span class="post-tag">' + category + "</span>";}).join("")}
        </div>
      </div>`;
    postsContainer.append(post);
};

/*********** FILTER BUTTON FUNCS **************/
const createFilter = (key, param, container) => {
    const filterButton = document.createElement("button");
    filterButton.className = "filter-button";
    filterButton.innerText = param;
    filterButton.setAttribute("data-state", "inactive");
    filterButton.addEventListener("click", (e) =>
        handleButtonClickFilter(e, key, param, container)
    );
    container.append(filterButton);
};
const handleButtonClickFilter = (e, key, param, container) => {
    const button = e.target;
    const buttonState = button.getAttribute("data-state");
    // button active/inactive toggle
    if (buttonState == "inactive") {
        button.classList.add("is-active");
        button.setAttribute("data-state", "active");
        currentFilters[key].push(param);
    } else {
        button.classList.remove("is-active");
        button.setAttribute("data-state", "inactive");
        currentFilters[key] = currentFilters[key].filter((item) => item !== param);
    }
    console.log("currentFilters[key]")
    console.log(currentFilters[key]);
    console.log("param");
    console.log(param);
    handleFilterPosts(currentFilters);
};

/*********** OVERVIEW BUTTON FUNCS **************/
const createOverview = (key, param, container) => {
    const filterButton = document.createElement("button");
    filterButton.className = "overview-button";
    filterButton.id = param;
    console.log(filterButton.id);
    // make a button click handler
    filterButton.addEventListener("click", (e) =>
        handleButtonClickOverview(e, key, param, container)
    );
    // when loading page Featured is selected by default
    if (param == "Featured") {
        filterButton.classList.add("is-active");
        filterButton.setAttribute("data-state", "active");
        currentFilters[key].push(param);
        handleFilterPosts(currentFilters);
    } else {
        filterButton.classList.remove("is-active");
        filterButton.setAttribute("data-state", "inactive");
    } 
    // add appropriate FA icons
    if (param == "Featured") {
        filterButton.innerHTML = `<i class="fa fa-star w3-margin-right"></i>${param}`;
    } else if (param == "All") {
        filterButton.innerHTML = `<i class="fa fa-globe w3-margin-right"></i>${param}`;
    } else if (param == "Personal") {
        filterButton.innerHTML = `<i class="fa fa-user w3-margin-right"></i>${param}`;
    } else if (param == "Commission") {
        filterButton.innerHTML = `<i class="fa fa-file-invoice-dollar w3-margin-right"></i>${param}`;
    } else if (param == "Work") {
        filterButton.innerHTML = `<i class="fa fa-briefcase w3-margin-right"></i>${param}`;
    }
    // alright now add this overview button to the container
    container.append(filterButton);
};
// dit cleart alleen de visuele selectie in html/css NIET de array!
const resetFilterButtons = (currentButton) => {
    // TODO: classes zodanig veranderen dat dit alleen effect heeft op de overview filters
    // want nu reset hij ook 
    const filterButtons = document.querySelectorAll('.overview-button');
    [...filterButtons].map(button => {
        if (button != currentButton) {
            button.classList.remove('is-active');
            button.setAttribute('data-state', 'inactive')
        }
    })
}
const resetPosts = () => {
    postsContainer.innerHTML = "";
    postsData.map((post) => createPost(post));
}
const handleButtonClickOverview = (e, key, param, container) => {
    const button = e.target;
    // button active/inactive toggle
    const buttonState = button.getAttribute('data-state');
    if (buttonState == 'inactive') {
        resetFilterButtons(button);
        var otherBtns = document.getElementsByClassName("content");
        for (var x = 0; x < otherBtns.length; x++) {
            x.setAttribute('data-state', 'inactive');
        }
        button.classList.add('is-active');
        button.setAttribute('data-state', 'active');
        currentFilters[key] = [];
        currentFilters[key].push(param);
        handleFilterPosts(currentFilters);
    }
};

// functie om posts te filteren en vervolgens weer te geven
const handleFilterPosts = (filters) => {
    console.log("zojuist gekozen filter:");
    console.log(filters);
    // nieuwe arrays maken zodat de originele niet gemutate wordt
    let filteredPosts = [...postsData];
    console.log("array with all my posts:")
    console.log(filteredPosts);

    console.log("succesfully chose to filter by category tag");

    let filterKeys = Object.keys(filters);
    console.log("filtering keys:")
    console.log(filterKeys);

    filterKeys.forEach((key) => {
        let currentKey = filters[key]
        if (currentKey.length <= 0) {
            return;
        }

        filteredPosts = filteredPosts.filter((post) => {
            let currentValue = post[key]
            return Array.isArray(currentValue)
                ? currentValue.some((val) => currentKey.includes(val))
                : currentKey.includes(currentValue);
        });
    });

    // filter posts zodat alleen de posts die alle geselecteerde tags bevatten weergegeven worden
    if (filters.categories.length > 0) {
        filteredPosts = filteredPosts.filter((post) =>
            filters.categories.every((filter) => {
                return post.categories.includes(filter);
            })
        );
    }
    console.log("tot nu toe:");
    console.log(filteredPosts);

    if (filters.level.length > 0) {
        filteredPosts = filteredPosts.filter((post) =>
            filters.level.some((filter) => {
                return post.level.includes(filter);
            })
        );
    }
    console.log("huidige selectie: ");
    console.log(filteredPosts);

    // clear post container en plaats de gefilterde posts op de pagina
    postsContainer.innerHTML = "";
    postCount.innerText = filteredPosts.length;
    filteredPosts.map((post) => createPost(post));
};
