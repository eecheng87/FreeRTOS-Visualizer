/* function to visualize queue */
var q_clock;
var q_updater;

{
    let canv = document.querySelector('.queue_cvs');
    let ctx = canv.getContext('2d');
    let cvs_origin_x = canv.getBoundingClientRect().left;
    let cvs_origin_y = canv.getBoundingClientRect().top;

    ctx.canvas.width = canv.parentElement.clientWidth;
    ctx.canvas.height = canv.parentElement.clientHeight;
    /*function updater(){

    }
    // also be controled in `logic.js`
    q_updater = updater;
    q_clock = setInterval(updater, 1000);*/
}