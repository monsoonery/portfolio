const images = [
    "decade_icon_transparent.png",
    "decade_banner_squidboards.png",
    "sniper.png",
    "decade_banner_squidboards.png",
    "sniper.png",
    "decade_banner_squidboards.png",
    "sniper.png",
    "decade_banner_squidboards.png",
    "sniper.png",
    "decade_banner_squidboards.png",
    "sniper.png",
    "decade_banner_squidboards.png",
    "sniper.png",
    "decade_banner_squidboards.png",
    "sniper.png"
];

// variables
dotContainer = document.getElementById("dot-container");
currentImage = document.getElementById("current-image");

fetch("https://raw.githubusercontent.com/monsoonery/portfolio/main/data.json")
    .then(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        projectsData = await response.json();

        console.log(projectsData[0]);

        loopy:for (i = 0; i< projectsData.length; i++) {
            if (projectsData[i]["projectnr"] == "1001") {
                currentProjectData = projectsData[i];
                break loopy;
            };
        }

        const {projectnr, title, link, icon, thumbnail, status, timeline, labels, tab, featured, images, video, intro, description} = currentProjectData;

        console.log(link);

        // generate dots below slideshow
        for (i = 0; i < images.length; i++) {
            let dot = document.createElement("span");
            dot.className = "dot";
            dot.setAttribute("id", "dot" + (i + 1));
            dot.addEventListener("click", updateSlideshow.bind(null, i));
            dotContainer.append(dot);
        }

        //initializing the slideshow
        updateSlideshow(0);
    }).catch(error => {
        console.log('There was an error', error);
    });




// eventhandler for dot click
function updateSlideshow(i) {
    currentImageNr = i;
    currentImage.src = images[currentImageNr];
    document.getElementById("numbertext").innerHTML = (i + 1) + ` / ` + images.length;
    document.querySelectorAll(".dot").forEach(function (el) {
        el.classList.remove("active")
    });
    thisDot = document.getElementById("dot" + (i + 1));
    thisDot.classList.add("active");
}

// eventhandler for button left/right click
function plusSlides(dir) {
    currentImageNr += dir;
    console.log(currentImageNr);
    if (currentImageNr >= images.length) {
        currentImageNr -= images.length;
    } else if (currentImageNr < 0) {
        currentImageNr += images.length;
    }
    updateSlideshow(currentImageNr);
}
