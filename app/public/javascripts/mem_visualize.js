/* function to visualize memory */
{
let canv = document.querySelector('.memory_cvs');
let ctx = canv.getContext('2d');
let cvs_origin_x = canv.getBoundingClientRect().left;
let cvs_origin_y = canv.getBoundingClientRect().top;

ctx.canvas.width  = canv.parentElement.clientWidth;
ctx.canvas.height = canv.parentElement.clientHeight;
}