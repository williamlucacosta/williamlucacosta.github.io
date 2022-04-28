const canvas = document.querySelector(".particles");
FitCanvasToContainer(canvas);
console.log(canvas);

function FitCanvasToContainer(canvas) {
    const parent = canvas.parentNode;
    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    
    canvas.style.width = parentWidth + "px";
    canvas.style.height = parentHeight + "px";
}

window.onresize = (e) => {
    FitCanvasToContainer(canvas);
};
