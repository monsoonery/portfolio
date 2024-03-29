var faPrintables = {
  prefix: 'fac',
  iconName: 'printables',
  icon: [100, 94.05, [], null, 'M0 94.05 32.61 75.24 0 56.43 0 94.05z M32.61 0 0 18.81 32.61 37.62 32.61 75.24 65.22 56.43 65.22 18.81 32.61 0z']
}

FontAwesome.library.add(
  faPrintables
)

function dirLevelUp() {
  if (document.location.pathname.includes("/projects/")) {
    return "../"
  } else {
    return "./"
  }
}

document.write(`
<div>
    <nav class="sidebar" id="mySidebar" onclick=closeSidebar()><br>
      <!-- Top area -->
      <div class="default-container">
        <!-- Logo -->
        <a href="index.html">
          <img src="/assets/images/common/icon.png" style="width:45%;" class="w3-round"><br><br>
        </a>
        <!-- Website name -->
        <h4><b>monsoon's design</b></h4>
      </div>
      <!-- Menu items -->
      <div class="menu-block">
        <a href="/" onclick="closeSidebar()" class="menu-item unlinkify"><i
            class="fa fa-house fa-fw fa-lg w3-margin-right"></i>Home</a>
        <a href="/projects" onclick="closeSidebar()" class="menu-item unlinkify"><i
            class="fa fa-th-large fa-fw fa-lg w3-margin-right"></i>Projects</a>
        <a href="/about" onclick="closeSidebar()" class="menu-item unlinkify"><i
            class="fa-solid fa-user fa-fw fa-lg w3-margin-right"></i>Contact</a>
      </div>
      <!-- Socials -->
      <div class="socials-panel">
        <a class="social-media-icon" href="https://instagram.com"><i class="fa fa-brands fa-instagram"></i></a>
        <a class="social-media-icon" href="https://twitter.com"><i class="fa fa-brands fa-twitter"></i></a>
        <a class="social-media-icon" href="https://linkedin.com"><i class=class="fa fa-brands fa-linkedin"></i></a>
        <a class="social-media-icon" href="https://github.com/monsoonery?tab=repositories"><i class="fa fa-brands fa-github"></i></a>
        <a class="social-media-icon" href="https://www.printables.com/@monsoonery"><i class="fac fa-printables"></i></a>
      </div>
      <div class="footer" id="myFooter">
        © 2023 me.
      </div>
    </nav>

    <!-- Overlay effect when opening sidebar on small screens -->
    <div class="overlay hide-on-large-screens" onclick="closeSidebar()" style="cursor:pointer" title="close side menu"
      id="myOverlay"></div>
  </div>
`);

sidebar = document.getElementById("mySidebar")
// functions to open and close sidebar on mobile
function openSidebar() {
  sidebar.classList.add("opened");
  document.getElementById("myOverlay").classList.add("visible");
}

function closeSidebar() {
  sidebar.classList.remove("opened");
  document.getElementById("myOverlay").classList.remove("visible");
  console.log("closed");
}

function onImgErrorSmall(source) {
  source.src = "/assets/images/common/placeholder.jpg";
  // disable onerror to prevent endless loop
  source.onerror = "";
  return true;
}