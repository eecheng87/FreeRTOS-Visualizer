/* function to visualize tasks */
var task_clock;
var task_updater;

{
    let root_dir = config.log_dir
    let canv = document.querySelector('.task_cvs');
    let ctx = canv.getContext('2d');
    let cvs_origin_x = canv.getBoundingClientRect().left;
    let cvs_origin_y = canv.getBoundingClientRect().top;
    let cvs_x_bound = canv.getBoundingClientRect().right;
    let x_off = 10;
    let info_file_index = config.info_file_index,
    info_file_limit = config.info_file_limit;

    ctx.canvas.width = canv.parentElement.clientWidth;
    ctx.canvas.height = canv.parentElement.clientHeight;

    function updater() {
        let meta = [
            [],
            []
        ]; /* 0: ready, 1: blocked */
        let info = readTextFile(`${root_dir}/task/${info_file_index.toString()}.txt`);
        ctx.clearRect(0, 0, canv.getBoundingClientRect().right, canv.getBoundingClientRect().bottom);
        parse_task_meta(meta, info);
        console.log(info)
        console.log(meta)
        visualize_task_meta(meta, ctx, x_off,
            x_off, cvs_x_bound, x_off);
        info_file_index = info_file_index == info_file_limit ? 1 : info_file_index + 1;
    }
    task_updater = updater;
    task_clock = setInterval(updater, 1000);
}