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
//make database

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
console.log(levelsContainer);


fetch(
    "https://raw.githubusercontent.com/monsoonery/portfolio/178cb80facc6432987d54dc467984a9245896e50/data.json"
).then(async (response) => {
    postsData = await response.json();
    console.log(postsData);
    postsData.map((post) => createPost(post));
    postCount.innerText = postsData.length;

    categoriesData = [
        ...new Set(
            postsData
                .map((post) => post.categories)
                .reduce((acc, curVal) => acc.concat(curVal), [])
        )
    ];
    categoriesData.map((category) => createFilter("categories", category, categoriesContainer)
    );

    levelData = [
        ...new Set(
            postsData
                .map((post) => post.level)
                .reduce((acc, curVal) => acc.concat(curVal), [])
        )
    ];
    levelData.map((level) => createFilter("level", level, levelsContainer)
    );
    console.log(levelData);
    console.log(categoriesData);
});


const createPost = (postData) => {
    const { title, link, image, categories, level } = postData;
    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
      <a class="post-preview" href="${link}" target="_blank">
        <img class="post-image" src="${image}">
      </a>
      <div class="post-content">
        <p class="post-title">${title}</p>
        <div class="post-tags">
          ${categories.map((category) => {
        return '<span class="post-tag">' + category + "</span>";
    }).join("")}
        </div>
      </div>
  `;
    postsContainer.append(post);
};

const createFilter = (key, param, container) => {
    const filterButton = document.createElement("button");
    filterButton.className = "filter-button";
    filterButton.innerText = param;
    filterButton.setAttribute("data-state", "inactive");
    filterButton.addEventListener("click", (e) =>
        handleButtonClick(e, key, param, container)
    );

    container.append(filterButton);
};

const handleButtonClick = (e, key, param, container) => {
    const button = e.target;
    const buttonState = button.getAttribute("data-state");

    if (key == "level") {
        resetFilterButtons(button);
    }

    if (buttonState == "inactive") {
        button.classList.add("is-active");
        button.setAttribute("data-state", "active");
        currentFilters[key].push(param);
        handleFilterPosts(currentFilters);
    } else {
        button.classList.remove("is-active");
        button.setAttribute("data-state", "inactive");
        currentFilters[key] = currentFilters[key].filter((item) => item !== param);
        handleFilterPosts(currentFilters);
        if (key == "level") {
            resetPosts();
        }
    }
};

const resetFilterButtons = (currentButton) => {
    const filterButtons = document.querySelectorAll('.filter-button');
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

const handleFilterPosts = (filters) => {
    let filteredPosts = [...postsData];
    let filterKeys = Object.keys(filters);

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

    if (filters.categories.length > 0) {
        filteredPosts = filteredPosts.filter((post) =>
            post.categories.some((category) => {
                return filters.categories.includes(category);
            })
        );

        filteredPosts = filteredPosts.filter((post) =>
            filters.categories.every((filter) => {
                return post.categories.includes(filter);
            })
        );
    }

    if (filters.level.length > 0) {
        filteredPosts = filteredPosts.filter((post) =>
            filters.level.includes(post.level)
        );
    }

    postCount.innerText = filteredPosts.length;

    if (filteredPosts.length == 0) {
        noResults.innerText = "Sorry, we couldn't find any results.";
    } else {
        noResults.innerText = "";
    }

    postsContainer.innerHTML = "";
    filteredPosts.map((post) => createPost(post));
};
