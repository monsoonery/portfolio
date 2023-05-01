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
var dotContainer;
var currentImage;
var images;
const descriptionSection = document.getElementById("description-container");
const vidSection = document.getElementById("video-container");
const gallerySection = document.getElementById("gallery-container");



fetch("https://raw.githubusercontent.com/monsoonery/portfolio/main/data.json")
    .then(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        projectsData = await response.json();

        // get project nr from html (it's just a number in an invisible div lol)
        ID = document.querySelector(".project-identifier").id;
        // find the project data associated with this number
        loopy: for (i = 0; i < projectsData.length; i++) {
            if (projectsData[i]["projectnr"] == "1001") {
                currentProjectData = projectsData[i];
                break loopy;
            };
        }

        //data entries van dit project uit json halen
        const { projectnr, title, link, icon, thumbnail, status, timeline, labels, tab, featured, video, intro, description } = currentProjectData;
        //images apart definieren omdat het een global var is (moet vanwege eventhandlers)
        images = currentProjectData["images"];

        // embed the video (if there is one)
        if (video) {
            vidSection.innerHTML = `<h3>Video</h3>`;
            viddiv = document.createElement("div");
            viddiv.className = "videowrapper";
            iframe = document.createElement("iframe");
            iframe.setAttribute("id", "current-video");
            iframe.setAttribute("frameborder", "0");
            iframe.src = video;
            viddiv.append(iframe);
            vidSection.append(viddiv);
        }

        // generate intro text
        introEl = document.createElement("p");
        introEl.innerHTML = `<b>` + intro + `</b>`;
        descriptionSection.append(introEl);
        // generate description (paragraphs) text
        for (i = 0; i < description.length; i++) {
            descEl = document.createElement("p");
            descEl.innerHTML = description[i];
            descriptionSection.append(descEl);
        }

        // generate slideshow section
        gallerySection.innerHTML = `<h3>Gallery</h3>
        <div class="slideshow-container">
            <div id="numbertext">0 / 0</div>
            <div class="slide">
                <img id="current-image">
                <!-- dit is waar de slideshow foto verschijnt-->
            </div>
            <button class="prev fa fa-angle-left" onclick="plusSlides(-1)"></button>
            <button class="next fa fa-angle-right" onclick="plusSlides(1)"></button>
        </div>
        <br>
        <div id="dot-container" style="text-align:center">
            <!-- dit is waar de dots verschijnen-->
        </div>`;
        dotContainer = document.getElementById("dot-container");
        currentImage = document.getElementById("current-image");

        // generate dots below slideshow and give them their eventhandlers
        for (i = 0; i < images.length; i++) {
            dot = document.createElement("span");
            dot.className = "dot";
            dot.setAttribute("id", "dot" + (i + 1));
            dot.addEventListener("click", updateSlideshow.bind(null, i));
            dotContainer.append(dot);
        }

        //initialize the slideshow
        updateSlideshow(0);
    }).catch(error => {
        console.log('There was an error', error);
        descEl = document.createElement("p");
        descEl.innerHTML = "Can't load project info at this time. Try again later. " + error;
        descriptionSection.append(descEl);
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