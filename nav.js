document.write('\
<nav class="w3-sidebar w3-collapse w3-animate-left" style="z-index:3;width:300px; background-color:#DECADE;" id="mySidebar"><br>\
    <div class="w3-container">\
      <a href="#" onclick="w3_close()" class="w3-hide-large w3-right w3-jumbo w3-padding w3-hover-grey" title="close menu">\
        <i class="fa fa-remove"></i>\
      </a>\
      <img src="iconwatermark.png" style="width:45%;" class="w3-round"><br><br>\
      <h4><b>[name].design</b></h4>\
    </div>\
    <div class="w3-bar-block">\
      <a id="menu-item-home" href="index.html" onclick="w3_close()" class="w3-bar-item w3-button w3-padding"><i class="fa fa-home fa-fw w3-margin-right"></i>Home</a>\
      <a href="projects.html" onclick="w3_close()" class="w3-bar-item w3-button w3-padding"><i class="fa fa-th-large fa-fw w3-margin-right"></i>Projects</a> \
      <a href="store.html" onclick="w3_close()" class="w3-bar-item w3-button w3-padding"><i class="fa fa-shop fa-fw w3-margin-right"></i>Store</a> \
      <a href="contact.html" onclick="w3_close()" class="w3-bar-item w3-button w3-padding"><i class="fa fa-envelope fa-fw w3-margin-right"></i>Contact</a>\
    </div>\
    <div class="w3-panel w3-large">\
      <i class="fa fa-instagram w3-hover-opacity"></i>\
      <i class="fa fa-twitter w3-hover-opacity"></i>\
      <i class="fa fa-linkedin w3-hover-opacity"></i>\
    </div>\
  </nav>\
  \
  <!-- Overlay effect when opening sidebar on small screens -->\
  <div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>\
');