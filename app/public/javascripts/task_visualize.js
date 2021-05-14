/* function to visualize tasks */
{
let canv = document.querySelector('.task_cvs');
let ctx = canv.getContext('2d');
let cvs_origin_x = canv.getBoundingClientRect().left;
let cvs_origin_y = canv.getBoundingClientRect().top;

draw_node(ctx, 10, 10, 10, 10, '#DEB886');
}