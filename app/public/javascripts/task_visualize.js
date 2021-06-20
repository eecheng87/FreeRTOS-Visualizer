/* function to visualize tasks */
var task_clock;
var task_updater;

{
    let canv = document.querySelector('.task_cvs');
    let ctx = canv.getContext('2d');
    let cvs_origin_x = canv.getBoundingClientRect().left;
    let cvs_origin_y = canv.getBoundingClientRect().top;
    let cvs_x_bound = canv.getBoundingClientRect().right;
    let x_off = 10,
        info_file_index = 1,
        info_file_limit = 4;

    ctx.canvas.width = canv.parentElement.clientWidth;
    ctx.canvas.height = canv.parentElement.clientHeight;

    function updater() {
        let meta = [
            [],
            []
        ]; /* 0: ready, 1: blocked */
        let info = readTextFile("spec/task/" + info_file_index.toString() + ".txt");
        ctx.clearRect(0, 0, canv.getBoundingClientRect().right, canv.getBoundingClientRect().bottom);
        parse_task_meta(meta, info);
        visualize_task_meta(meta, ctx, x_off,
            x_off, cvs_x_bound, x_off);
        info_file_index = info_file_index == info_file_limit ? 1 : info_file_index + 1;
    }
    task_updater = updater;
    task_clock = setInterval(updater, 1000);
}