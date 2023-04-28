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
// change class and function names

let postsData = "";
let currentFilters = {
    labels: [],
    tab: ["Featured"],
    sort: "a-z"
};

const postsContainer = document.getElementById("posts-container");
const labelsContainer = document.getElementById("post-labels");
const tabsContainer = document.getElementById("post-tab");
const postCount = document.getElementById("post-count");
const noResults = document.getElementById("no-posts");

// this is where the magic happens
fetch("https://raw.githubusercontent.com/monsoonery/portfolio/f4abb3494668ca6ad088c8f2fc6f387dc858fe08/data.json")
    .then(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        postsData = await response.json();

        // maak een html elementje voor elke post
        postsData.map((post) => createPost(post));
        // totaal aantal posts die we hebben
        postCount.innerText = postsData.length;

        // voor elk overview filter een knopje maken
        tabData = ["Featured", "All", "Personal", "Commission", "Work"]
        tabData.map((tab) => createTabButton("tab", tab, tabsContainer)
        );

        // scan alle posts om alle mogelijke label tags te verzamelen
        labelsData = Array.from([
            ...new Set(
                postsData
                    .map((post) => post.labels)
                    .reduce((acc, curVal) => acc.concat(curVal), [])
            )
        ]);
        labelsData.sort(); //sorteren op alphabet
        // voor elke categorie een filter knopje maken
        labelsData.map((label) => createLabelButton("labels", label, labelsContainer)
        );
        handleFilterPosts(currentFilters);
    });

/* POST CREATION FUNCTION */
const createPost = (postData) => {
    const { title, link, image, status, timeline, labels, tab } = postData;
    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
    <div class="post-column">
      <a class="post-preview" href="${link}">
        <img class="post-image" src="${image}">
      </a>
      <div class="post-content">
        <p class="post-title">${title}</p>
        <div class="post-tags">
          ${labels.map((label) => { return '<span class="post-tag">' + label + "</span>"; }).join("")}
        </div>
      </div>
      </div>`;
    postsContainer.append(post);
};

/*********** FILTER BUTTON FUNCS **************/
const createLabelButton = (key, param, container) => {
    const filterButton = document.createElement("button");
    filterButton.className = "filter-button";
    filterButton.innerText = param;
    filterButton.setAttribute("data-state", "inactive");
    filterButton.addEventListener("click", (e) =>
        handleButtonClickLabel(e, key, param, container)
    );
    container.append(filterButton);
};
const handleButtonClickLabel = (e, key, param, container) => {
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
    handleFilterPosts(currentFilters);
};

/*********** OVERVIEW BUTTON FUNCS **************/
const createTabButton = (key, param, container) => {
    const filterButton = document.createElement("button");
    filterButton.className = "overview-button";
    filterButton.id = param;
    console.log(param);
    // make a button click handler
    filterButton.addEventListener("click", (e) =>
        handleButtonClickTab(e, key, param, container)
    );
    // when loading page Featured is selected by default
    if (param == "Featured") {
        filterButton.classList.add("is-active");
        filterButton.setAttribute("data-state", "active");
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
const handleButtonClickTab = (e, key, param, container) => {
    const button = e.target;
    // button active/inactive toggle
    const buttonState = button.getAttribute('data-state');
    if (buttonState == 'inactive') {
        resetFilterButtons(button);
        otherBtns = document.getElementsByClassName("content");
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

function handleSort() {
    currentFilters["sort"] = [];
    currentFilters["sort"].push(this.value);
    handleFilterPosts(currentFilters);
}
document.getElementById("sort-dropdown").onchange = handleSort;

// functie om posts te filteren en vervolgens weer te geven
const handleFilterPosts = (filters) => {
    console.log("zojuist gekozen filters:");
    console.log(filters);
    // nieuwe array maken zodat de originele niet gemutate wordt
    let filteredPosts = [...postsData];
    console.log("array with all my posts:")
    console.log(filteredPosts);

    // stap 1: filter posts op basis van featured/all/commission etc
    if (filters.tab.length == 1) {
        filteredPosts = filteredPosts.filter((post) =>
            filters.tab.some((filter) => {
                return post.tab.includes(filter);
            })
        );
    } else {
        alert("dr gaat iets mis met die overview sort");
    }

    // stap 2: filter posts zodat alleen de posts die alle geselecteerde tags bevatten weergegeven worden
    if (filters.labels.length > 0) {
        filteredPosts = filteredPosts.filter((post) =>
            filters.labels.every((filter) => {
                return post.labels.includes(filter);
            })
        );
    } else {
        //als geen tags zijn geselecteerd valt er ook niks te sorten :)
    }

    // stap 3: sorteer de posts
    if (filters.sort == "a-z") {
        filteredPosts.sort(function (a, b) {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });
    } else if (filters.sort == "z-a") {
        filteredPosts.sort(function (a, b) {
            return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        });
    } else if (filters.sort == "relevance") {
        // algoritme momentje
    }

    // clear post container en plaats de gefilterde posts op de pagina
    console.log("huidige selectie: ");
    console.log(filteredPosts);
    postsContainer.innerHTML = "";
    postCount.innerText = filteredPosts.length;
    filteredPosts.map((post) => createPost(post));
};
