function dirLevelUp() {
    if (document.location.pathname.includes("/projects/")) {
        return "../"
    } else {
        return ""
    }
}

document.write(`
<!-- Sidebar/menu -->
<div>
        <nav class="w3-sidebar w3-collapse w3-animate-left" id="mySidebar"><br>
            <!-- Top area -->
            <div class="default-container">
                <!-- Close sidebar menu (visible on small screens only) -->
                <a href="#" onclick="closeSidebar()"
                    class="hide-on-large-screens float-right w3-jumbo w3-padding hover-text-grey unlinkify"
                    title="close menu">
                    <i class="fa fa-remove"></i>
                </a>
                <!-- Logo -->
                <a href="index.html">
                    <img src="/icon.png" style="width:45%;" class="w3-round"><br><br>
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
                <a href="/store" onclick="closeSidebar()" class="menu-item unlinkify"><i
                        class="fa fa-store fa-fw fa-lg w3-margin-right"></i>Store</a>
                <a href="/contact" onclick="closeSidebar()" class="menu-item unlinkify"><i
                        class="fa fa-envelope fa-fw fa-lg w3-margin-right"></i>Contact</a>
            </div>
            <!-- Socials -->
            <div class="socials-panel">
                <a class="fa fa-lg fa-brands fa-instagram social-media-icon" href="https://instagram.com"></a>
                <a class="fa fa-brands fa-twitter social-media-icon" href="https://twitter.com"></a>
                <a class="fa fa-brands fa-linkedin social-media-icon" href="https://linkedin.com"></a>
                <a class="fa fa-brands fa-github social-media-icon"
                    href="https://github.com/monsoonery?tab=repositories"></a>
                <!-- Printables icon -->
                <svg class="social-media-icon" width="1em" height="1em" style="vertical-align:middle">
                    <a href="https://www.printables.com/@monsoonery" style="padding: 12px 16px;">
                        <polygon _ngcontent points="0 94.05 32.61 75.24 0 56.43 0 94.05" transform="scale(0.18 0.18)">
                        </polygon>
                        <polygon _ngcontent points="32.61 0 0 18.81 32.61 37.62 32.61 75.24 65.22 56.43 65.22 18.81 32.61 0"
                            transform="scale(0.18 0.18)"></polygon>
                </svg>
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

// functions to open and close sidebar
function openSidebar() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function closeSidebar() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}


