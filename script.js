function getMonthName(monthNumber) {
    const date = new Date();
    date.setDate(15);
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {month: 'long',});
}

// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

let projectsData = "";
let currentFilters = {
    labels: [],
    tab: ["Featured"],
    sort: "a-z"
};

const projectsContainer = document.getElementById("projects-container");
const labelsContainer = document.getElementById("project-labels");
const tabsContainer = document.getElementById("project-tabs");
const filtersContainer = document.getElementById("sort-filter-container");
filtersContainer.style.maxHeight = null;
filtersContainer.style.height = "0";
filtersContainer.style.display = "none";
const projectCount = document.getElementById("project-count");
const sortFilterButton = document.getElementById("sort-filter-button");

// this is where the magic happens
fetch("https://raw.githubusercontent.com/monsoonery/portfolio/main/data.json")
    .then(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        projectsData = await response.json();

        // totaal aantal projects die we hebben
        projectCount.innerText = projectsData.length;

        // maak een html elementje voor elk project
        projectsData.map((project) => createProject(project));

        // voor elke tab een knopje maken
        tabData = ["Featured", "All", "Personal", "Work"]
        tabData.map((tab) => createTabButton("tab", tab, tabsContainer));

        // scan alle projects om alle mogelijke label tags te verzamelen
        labelsData = Array.from([
            ...new Set(
                projectsData
                    .map((project) => project.labels)
                    .reduce((acc, curVal) => acc.concat(curVal), [])
            )
        ]);
        labelsData.sort(); //sorteren op alphabet
        // voor elke categorie een filter knopje maken
        labelsData.map((label) => createLabelButton("labels", label, labelsContainer));

        // filter, sort and finally display the projects (featured en a-z on page load)
        handleFilterProjects(currentFilters);
    });

function getTimeline(timeline) {
    var startDate = timeline[0];
    var endDate = timeline[1];
    if (JSON.stringify(startDate).trim() == JSON.stringify(endDate).trim()) {
        // format for single-month projects
        return getMonthName(startDate[1]) + ' ' + startDate[0];
    } else if (JSON.stringify(endDate).trim() == "[0,0]") {
        // format for ongoing/no end date projects
        return getMonthName(startDate[1]) + ' ' + startDate[0] + ' &ndash; ';
    } else {
        if (startDate[0] == endDate[0]) {
            // format for multi-month projects, but completed within the same year
            return getMonthName(startDate[1]) + ' &ndash; ' + getMonthName(endDate[1]) + ' ' + endDate[0]
        } else {
            // everything else
            return getMonthName(startDate[1]) + ' ' + startDate[0] + ' &ndash; ' + getMonthName(endDate[1]) + ' ' + endDate[0]
        }
    }
    return "no date"
}

/* project CREATION FUNCTION */
const createProject = (projectData) => {
    const { title, link, icon, image, status, timeline, labels, tab } = projectData;
    const project = document.createElement("div");
    project.className = "project";
    if (icon == "") {

    } 
    // determine how to display month / date etc 
    project.innerHTML = `
    <div class="project-column">
        <a href="${link}">
            <div class="project-preview">
                <img class="project-image" src="${image}" alt="${title}">
            </div>
            <div class="project-content">
                <p class="project-title">`
                    // insert FA icon or custom icon depending on whether or not this post has a custom icon
                    + (icon == "" ? `<i class="fa fa-circle-half-stroke"> </i>` : `<img src="${icon}" style="width:15px; height: 15px;">`) +
                    ` ${title}
                </p>
                <div class="project-status">
                    ${status} (` + getTimeline(timeline) + `)
                </div>
                <div class="project-tags">
                    ${labels.map((label) => { return '<span class="project-tag">' + label + "</span>"; }).join("")}
                </div>
            </div>
        </a>
    </div>`;
    project.onmouseenter = cardMouseEnter;
    projectsContainer.append(project);
};

/*********** FILTER BUTTON FUNCS **************/
const createLabelButton = (key, param, container) => {
    const filterButton = document.createElement("button");
    filterButton.className = "label-button";
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
    handleFilterProjects(currentFilters);
};

/*********** OVERVIEW BUTTON FUNCS **************/
const createTabButton = (key, param, container) => {
    const filterButton = document.createElement("button");
    filterButton.className = "tab-button";
    filterButton.id = param;
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
        filterButton.innerHTML = `<i class="fa fa-star FA-tab-margin"></i>${param}`;
    } else if (param == "All") {
        filterButton.innerHTML = `<i class="fa fa-globe FA-tab-margin"></i>${param}`;
    } else if (param == "Personal") {
        filterButton.innerHTML = `<i class="fa fa-user FA-tab-margin"></i>${param}`;
    } else if (param == "Commission") {
        filterButton.innerHTML = `<i class="fa fa-file-invoice-dollar FA-tab-margin"></i>${param}`;
    } else if (param == "Work") {
        filterButton.innerHTML = `<i class="fa fa-briefcase FA-tab-margin"></i>${param}`;
    }
    // alright now add this overview button to the container
    container.append(filterButton);
};
// dit cleart alleen de visuele selectie in html/css NIET de array!
const resetFilterButtons = (currentButton) => {
    const filterButtons = document.querySelectorAll('.tab-button');
    [...filterButtons].map(button => {
        if (button != currentButton) {
            button.classList.remove('is-active');
            button.setAttribute('data-state', 'inactive')
        }
    })
}
const resetProjects = () => {
    projectsContainer.innerHTML = "";
    projectsData.map((project) => createProject(project));
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
        handleFilterProjects(currentFilters);
    }
};

// functie voor als de waarde in de sort dropdown wordt veranderd
function handleSort() {
    currentFilters["sort"] = [];
    currentFilters["sort"].push(this.value);
    handleFilterProjects(currentFilters);
}
document.getElementById("sort-dropdown").onchange = handleSort;

// functie om projects te filteren en vervolgens weer te geven
const handleFilterProjects = (filters) => {
    // nieuwe array maken zodat de originele niet gemutate wordt
    let filteredProjects = [...projectsData];

    // stap 1: filter projects op basis van featured/all/work/personal etc
    if (filters.tab.length == 1) {
        //exceptions for featured tab
        if (filters.tab[0] == "Featured") {
            filteredProjects = filteredProjects.filter((project) => {
                return project.featured;
            });
            // bij de features tab moet sort & filter disabled zijn
            document.querySelectorAll('.hide-on-featured').forEach(function (el) {
                el.style.display = 'none';
            });
        } else {
            filteredProjects = filteredProjects.filter((project) =>
                filters.tab.some((filter) => {
                    return project.tab.includes(filter);
                })
            );
            document.querySelectorAll('.hide-on-featured').forEach(function (el) {
                el.style.display = 'block';
            });
        }
    } else {
        alert("dr gaat iets mis met die overview sort");
    }

    // stap 2: filter projects zodat alleen de projects die alle geselecteerde tags bevatten weergegeven worden
    // dit moet alleen bij non-featured tab
    if (filters.tab[0] != "Featured" && filters.labels.length > 0) {
        filteredProjects = filteredProjects.filter((project) =>
            filters.labels.every((filter) => {
                return project.labels.includes(filter);
            })
        );
    } else {
        //als geen tags zijn geselecteerd valt er ook niks te sorten :)
    }

    // stap 3: sorteer de projects
    if (filters.sort == "a-z") {
        filteredProjects.sort(function (a, b) {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });
    } else if (filters.sort == "z-a") {
        filteredProjects.sort(function (a, b) {
            return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        });
    } else if (filters.sort == "relevance") {
        // algoritme momentje
    }

    // clear project container en plaats de gefilterde projects op de pagina
    console.log("huidige selectie: ");
    console.log(filteredProjects);
    projectsContainer.innerHTML = "";
    projectCount.innerText = filteredProjects.length;
    filteredProjects.map((project) => createProject(project));
};

let cardMouseEnter = function () {
    num = (Math.random() * 1.5 + 0.5) * (Math.random() >= 0.5 ? 1 : -1);
    document.querySelector(':root').style.setProperty("--rotate-card", num);
};

let filterContainerExpandFunction = function () {
    filterIcon = document.getElementById("sort-filter-icon");
    if (filtersContainer.style.maxHeight) {
        // currently open, so close it
        filtersContainer.style.height = "150px";
        filtersContainer.classList.remove("open");
        filtersContainer.style.maxHeight = null;
        filtersContainer.style.height = 0;
        filterIcon.classList.remove("fa-angles-up");
        filterIcon.classList.add("fa-angles-down");
    } else {
        // currently closed, so open it
        filtersContainer.style.display = "block";
        filtersContainer.classList.add("open");
        filtersContainer.style.height = filtersContainer.scrollHeight + "px";
        filtersContainer.style.maxHeight = filtersContainer.scrollHeight + "px";
        filterIcon.classList.remove("fa-angles-down");
        filterIcon.classList.add("fa-angles-up");
    }
}

sortFilterButton.addEventListener("click", (e) => {
    filterContainerExpandFunction();
});


window.addEventListener('resize', function (event) {
    if (filtersContainer.classList.contains("open")) {
        filtersContainer.style.height = "auto";
        filtersContainer.style.maxHeight = filtersContainer.scrollHeight + "px";
    }
}, true);