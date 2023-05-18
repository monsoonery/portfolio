// date & timeline processing functions
function getMonthName(monthNumber) {
    const date = new Date();
    date.setDate(15);
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', { month: 'long', });
}

function getTimeline(timeline) {
    var startDate = timeline[0];
    var endDate = timeline[1];
    if (JSON.stringify(startDate).trim() == JSON.stringify(endDate).trim()) {
        // format for single-month projects
        return getMonthName(startDate[1]) + ' ' + startDate[0];
    } else if (JSON.stringify(endDate).trim() == "[9999,99]") {
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

// sorting functions
function dateAscending(a, b) {
    if (a.timeline[1][0] < b.timeline[1][0]) {
        return -1;
    } else if (a.timeline[1][0] > b.timeline[1][0]) {
        return 1;
    } else {
        if (a.timeline[1][1] < b.timeline[1][1]) {
            return -1;
        } else if (a.timeline[1][1] > b.timeline[1][1]) {
            return 1;
        }
    }
}

function alphabeticalAZ(a, b) {
    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
}


// variables for project data
let projectsData = "";
let currentFilters = {
    labels: [],
    tab: ["Featured"], //default tab on page load
    sort: "date descending" //default sort on page load
};
const projectsContainer = document.getElementById("projects-container");
const labelsContainer = document.getElementById("project-labels");
const tabsContainer = document.getElementById("project-tabs");
const projectCount = document.getElementById("project-count");
const sortFilterButton = document.getElementById("sort-filter-button");
const filtersContainer = document.getElementById("sort-filter-container");
filtersContainer.style.maxHeight = null;
filtersContainer.style.height = "0";
filtersContainer.style.display = "none";
let cookietab = sessionStorage.getItem("tab");
console.log(cookietab);

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
        tabData.map((tab) => createTabButton(tab, tabsContainer));

        // check alle projects om alle label tags te verzamelen
        // bewaar ze in een set en reduce zodat er geen doubles zijn
        // en converteer naar array zodat je alfabetisch kan sorten
        labelsData = Array.from([
            ...new Set(
                projectsData
                    .map((project) => project.labels)
                    .reduce((acc, curVal) => acc.concat(curVal), [])
            )
        ]).sort();

        // voor elke categorie een filter knopje maken
        labelsData.map((label) => createLabelButton("labels", label, labelsContainer));

        // filter, sort and finally display the projects (featured en a-z on page load)
        if (!cookietab) {
        } else {
            currentFilters["tab"] = [];
            currentFilters["tab"].push(cookietab);
        }
        handleFilterProjects(currentFilters);
    }).catch(error => {
        console.log('There was an error', error);
        projectsContainer.textContent = "\r\nCan't load projects right now. Please try again later.";
    });

/* project CREATION FUNCTION */
const createProject = (projectData) => {
    const { title, link, icon, thumbnail, status, timeline, labels, tab } = projectData;
    const project = document.createElement("div");
    project.className = "project";
    // generate HTML for a project card 
    project.innerHTML = `
    <div class="project-column">
        <a href="${link}">
            <div class="project-preview">
                <img class="project-thumbnail" src="${thumbnail}" alt="${title}">
            </div>
            <div class="project-content">
                <p class="project-title">` +
        // insert FA icon or img depending on whether or not this project has a custom icon in data.json
        (icon == "" ? `<i class="fa fa-circle fa-xs"> </i>` : `<img src="${icon}" style="width:15px; height: 15px;">`) +
        ` ${title}
                </p>
                <div class="project-status">
                    ${status} (` + getTimeline(timeline) + `)
                </div>
                <div class="project-tags">
                    ${labels.map((label) => {
            return '<span class="project-tag">' + label + "</span>";
        }).join("")}
                </div>
            </div>
        </a>
    </div>`;
    // add eventlistener for rotation animation on hovering over card
    project.addEventListener("mouseenter", cardMouseEnter);
    projectsContainer.append(project);
};

// generate tab buttons (for broad category filtering: work vs personal (+ featured))
function createTabButton(param, container) {
    currentButton = document.querySelector("#" + param);
    currentButton.addEventListener("click", (e) => handleButtonClickTab(e, param));
    // when loading page, go to tab currently stored in cookie data
    // if no cookie data present, go to featured tab by default
    console.log(sessionStorage.getItem("tab"));
    if (!cookietab) {
        if (param == "Featured") {
            currentButton.setAttribute("data-state", "active");
            currentButton.classList.add('is-active');
            console.log("defaulted to featured");
            console.log(param);
        } else {
            currentButton.setAttribute("data-state", "inactive");
            currentButton.classList.remove('is-active');
            console.log("de rest inactief");
            console.log(param);
        }
    } else {
        if (param == cookietab) {
            currentButton.setAttribute("data-state", "active");
            currentButton.classList.add('is-active');
            console.log("2");
            console.log(param);
        } else {
            currentButton.setAttribute("data-state", "inactive");
            currentButton.classList.remove('is-active');
            console.log("3");
            console.log(param);
        }
    }
}

function resetFilterButtons(currentButton) {
    const filterButtons = document.querySelectorAll('.tab-button');
    [...filterButtons].map(button => {
        if (button != currentButton) {
            button.classList.remove('is-active');
            button.setAttribute('data-state', 'inactive');
        }
    });
}

// EL voor tab buttons
function handleButtonClickTab(e, param) {
    const button = e.target;
    // button active/inactive toggle
    const buttonState = button.getAttribute('data-state');
    if (buttonState == 'inactive') {
        // de functie hieronder cleart alleen de visuele selectie in html/css NIET de array! dat gebeurt eronder pas
        resetFilterButtons(button);
        button.classList.add('is-active');
        button.setAttribute('data-state', 'active');
        sessionStorage.setItem("tab", param);
        currentFilters["tab"] = []; //clear tab filters
        currentFilters["tab"].push(param); //add this tab to filter
        console.log(currentFilters);
        handleFilterProjects(currentFilters);
    }
    sessionStorage.setItem("tab", param);
    window.scrollTo(0, 0);
}

// generate a label button (for filtering by project type)
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

// EL for label buttons
function handleButtonClickLabel(e, key, param, container) {
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
}

// EL for "sort by" dropdown
document.getElementById("sort-dropdown").addEventListener("change", (event) => {
    currentFilters["sort"] = [];
    currentFilters["sort"].push(event.target.value);
    handleFilterProjects(currentFilters);
});

// filters, sorts and displays project cards based on selection in currentFilters
function handleFilterProjects(filters) {
    let filteredProjects = [...projectsData];

    if (filters.tab.length == 1) {
        // speciale filterregels voor featured tab
        if (filters.tab[0] == "Featured") {
            // laat alleen projects zien die ik wil featuren ("featured": true in json)
            filteredProjects = filteredProjects.filter((project) => {
                return project.featured;
            });
            // bij de featured tab moeten de sort & filter opties disabled zijn
            document.querySelectorAll('.hide-on-featured').forEach(function (el) {
                el.style.display = 'none';
            });
        } else {
            // niet featured? --> stap 1: filteren adhv all/work/personal
            filteredProjects = filteredProjects.filter((project) =>
                filters.tab.some((filter) => {
                    return project.tab.includes(filter);
                })
            );

            // stap 2: filteren adhv eventueel geselecteerde labels
            if (filters.labels.length > 0) {
                filteredProjects = filteredProjects.filter((project) =>
                    filters.labels.every((filter) => {
                        return project.labels.includes(filter);
                    })
                );
            }

            // stap 3: sorteren adhv sort by dropdown
            if (filters.sort == "a-z") { filteredProjects.sort(alphabeticalAZ) }
            else if (filters.sort == "z-a") { filteredProjects.sort(alphabeticalAZ).reverse() }
            // else if (filters.sort == "relevance") {filteredProjects.sort(relevance)} 
            else if (filters.sort == "date ascending") { filteredProjects.sort(dateAscending) }
            else if (filters.sort == "date descending") { filteredProjects.sort(dateAscending).reverse() }

            // last step: bij deze tabs moeten de sort & filter opties wel zichtbaar zijn
            document.querySelectorAll('.hide-on-featured').forEach(function (el) {
                el.style.display = 'block';
            });
        }
    } else {
        alert("dr gaat iets mis met die overview sort");
    }

    // clear project container en plaats de gefilterde projects op de pagina
    projectsContainer.innerHTML = "";
    projectCount.innerText = filteredProjects.length;
    if (filteredProjects.length == 0) {
        projectsContainer.textContent = "\r\nNo projects matching the currently selected filters.";
    }
    filteredProjects.map((project) => createProject(project));
}

// Generates random rotation angle on project card mouse hover
function cardMouseEnter() {
    num = (Math.random() * 1.5 + 0.5) * (Math.random() >= 0.5 ? 1 : -1);
    document.querySelector(':root').style.setProperty("--rotate-card", num);
};

// EL for sort & filter button (expand/collapse section)
sortFilterButton.addEventListener("click", (e) => {
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
});

// EL to resize sort & filter section with window resize
window.addEventListener('resize', function (event) {
    if (filtersContainer.classList.contains("open")) {
        filtersContainer.style.height = "auto";
        filtersContainer.style.maxHeight = filtersContainer.scrollHeight + "px";
    }
}, true);

