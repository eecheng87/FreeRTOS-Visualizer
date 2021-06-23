/* function to visualize memory */
var mem_clock;
var mem_updater;

{
    let canv = document.querySelector('.memory_cvs');
    let ctx = canv.getContext('2d');
    let cvs_origin_x = canv.getBoundingClientRect().left;
    let cvs_origin_y = canv.getBoundingClientRect().top;
    let root_dir = config.log_dir

    let info_file_index = config.info_file_index,
        info_file_limit = config.info_file_limit;

    ctx.canvas.width = canv.parentElement.clientWidth;
    ctx.canvas.height = canv.parentElement.clientHeight;


    function updater() {

        let meta = [
            [],
            []
        ]
        let info = readTextFile(`${root_dir}/task/${info_file_index.toString()}.txt`);
        parse_task_meta(meta, info);
        data = meta[0].concat(meta[1]);
        data = data.filter(ele => ele != undefined || ele != null);
        data.sort((a, b) => {
            let diff = a.stack - b.stack;
            return (diff) == 0 ? 0 :
                (diff > 0) ? 1 : -1;
        })
        ctx.clearRect(0, 0, canv.getBoundingClientRect().right, canv.getBoundingClientRect().bottom);
        visualize_mem_meta(data, ctx);
        info_file_index = info_file_index == info_file_limit ? 1 : info_file_index + 1;
    }

    mem_updater = updater
    mem_clock = setInterval(updater, 1000)
}