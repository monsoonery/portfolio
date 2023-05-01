// const images = [
//     "decade_icon_transparent.png",
//     "decade_banner_squidboards.png",
//     "sniper.png",
//     "decade_banner_squidboards.png",
//     "sniper.png",
//     "decade_banner_squidboards.png",
//     "sniper.png",
//     "decade_banner_squidboards.png",
//     "sniper.png",
//     "decade_banner_squidboards.png",
//     "sniper.png",
//     "decade_banner_squidboards.png",
//     "sniper.png",
//     "decade_banner_squidboards.png",
//     "sniper.png"
// ];

// variables
const dotContainer = document.getElementById("dot-container");
const currentImage = document.getElementById("current-image");
var images;

fetch("https://raw.githubusercontent.com/monsoonery/portfolio/main/data.json")
    .then(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        projectsData = await response.json();

        // find the project data associated with this page
        loopy:for (i = 0; i< projectsData.length; i++) {
            if (projectsData[i]["projectnr"] == "1001") {
                currentProjectData = projectsData[i];
                break loopy;
            };
        }

        //data van dit project uit json halen
        const {projectnr, title, link, icon, thumbnail, status, timeline, labels, tab, featured, video, intro, description} = currentProjectData;
        //images apart definieren omdat het een global var is (moet vanwege eventhandlers)
        images = currentProjectData["images"];
        console.log(projectnr);
        console.log(title);
        console.log(link);
        console.log(icon);
        console.log(thumbnail);
        console.log(status);
        console.log(timeline);
        console.log(labels);
        console.log(tab);
        console.log(featured);
        console.log(images)
        console.log(video);
        console.log(intro);
        console.log(description);
        

        

        // generate dots below slideshow
        for (i = 0; i < images.length; i++) {
            let dot = document.createElement("span");
            dot.className = "dot";
            dot.setAttribute("id", "dot" + (i + 1));
            dot.addEventListener("click", updateSlideshow.bind(null, i));
            dotContainer.append(dot);
        }

        //initialize the slideshow
        updateSlideshow(0);

        // embed the video
        console.log(video);
        document.getElementById("current-video").src = video;
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
    if (currentImageNr >= images.length) {
        currentImageNr -= images.length;
    } else if (currentImageNr < 0) {
        currentImageNr += images.length;
    }
    updateSlideshow(currentImageNr);
}
