/* function to visualize tasks */
{
let canv = document.querySelector('.task_cvs');
let ctx = canv.getContext('2d');
let cvs_origin_x = canv.getBoundingClientRect().left;
let cvs_origin_y = canv.getBoundingClientRect().top;
let cvs_x_bound = canv.getBoundingClientRect().right;
let x_off = 10;
let meta = [[], []]; /* 0: ready, 1: blocked */
let info = readTextFile("spec/task_test.txt");

ctx.canvas.width  = canv.parentElement.clientWidth;
ctx.canvas.height = canv.parentElement.clientHeight;

parse_task_meta(meta, info);
visualize_task_meta(meta, ctx, cvs_origin_x + x_off,
    cvs_origin_y + x_off, cvs_x_bound, x_off);

}