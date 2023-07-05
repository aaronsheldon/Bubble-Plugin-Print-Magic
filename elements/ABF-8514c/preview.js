function(instance, properties) {
    
    // Do nothing except show the icon
    const poster = new Image(28, 28);
    poster.src = "https://meta.cdn.bubble.io/f1672943730799x960759320908104100/printjs.ico";
    poster.style.position = "absolute";
    poster.style.top = "2px";
    poster.style.left = "2px";
    instance.canvas.appendChild(poster);
    instance.canvas.style.overflow = "hidden";
}