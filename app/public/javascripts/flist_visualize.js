/* function to visualize queue */
var fl_clock;
var fl_updater;

{
    let canv = document.querySelector('.flist_cvs');
    let ctx = canv.getContext('2d');
    let cvs_origin_x = canv.getBoundingClientRect().left;
    let cvs_origin_y = canv.getBoundingClientRect().top;
    let root_dir = config.log_dir

    ctx.canvas.width = canv.parentElement.clientWidth;
    ctx.canvas.height = canv.parentElement.clientHeight;
    let info_file_index = config.info_file_index,
        info_file_limit = config.info_file_limit;

    function updater() {
        let meta = [
            [],
            []
        ];
        // 0: info summ. 1: detail of free block
        // let info = readTextFile("spec/heap/" + info_file_index.toString() + ".txt");
        let info = readTextFile(`${root_dir}/heap/${info_file_index.toString()}.txt`);
        ctx.clearRect(0, 0, canv.getBoundingClientRect().right, canv.getBoundingClientRect().bottom);
        parse_task_meta(meta, info);
        visualize_flist_meta(meta, ctx, 40,
            20, ctx.canvas.width, 10);
        info_file_index = info_file_index == info_file_limit ? 0 : info_file_index + 1;
    }
    // also be controled in `logic.js`
    fl_updater = updater;
    fl_clock = setInterval(updater, 1000);
}