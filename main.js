// check if mobile layout is needed for sidebar on page load
sidebar = document.getElementById("mySidebar")
function updateLayout() {
    if (window.innerWidth < 992) {
        mobileLayout = true;
        sidebar.classList.add("mobile");
    } else if (window.innerWidth > 992) {
        mobileLayout = false;
        sidebar.classList.remove("mobile");
    }
}
updateLayout();
window.addEventListener('resize', updateLayout, false);

// functions to open and close sidebar on mobile
function openSidebar() {
    sidebar.classList.add("openMobile");
    document.getElementById("myOverlay").classList.add("visible");
}

function closeSidebar() {
    if (mobileLayout) {
        sidebar.classList.remove("openMobile");
        document.getElementById("myOverlay").classList.remove("visible");
        console.log("closed");
    }
}
