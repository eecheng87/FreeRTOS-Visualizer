// default
var timer_run = true;

{
    let node_body_color = '#33BBFF';
    let node_inner_color = '#5894D7';

    function hexToRgbR(hex, seed) {
        /* smooth random version */
        let bigint = parseInt(hex.substring(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        r += (seed % 60 + 10);
        b += (seed % 60);

        return "(" + r + "," + g + "," + b + ")";
    }

    function readTextFile(file) {
        let rawFile = new XMLHttpRequest();
        let allText;
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    allText = rawFile.responseText;
                }
            }
        }
        rawFile.send(null);
        return allText;
    }

    function parse_task_meta(meta, info) {
        let meta_index = 0,
            zero = 0;
        let lines = info.split("\n");
        lines.forEach(line => {
            if (line.length < 1) {
                return;
            }
            if (line[0] == '0') {
                zero += 1;
                return;
            }
            if (line[0] == 'x') {
                meta_index += 1;
                return;
            }
            obj = new Object();
            items = line.split(";");
            items.forEach(item => {
                /* filter */
                if (item.split("=")[0] == "heapSTRUCT_SIZE")
                    return;
                obj[item.split("=")[0]] = item.split("=")[1];
            });
            filed = meta[meta_index].push(obj);
        });
    }

    function visualize_task(ctx, node, x, y, w, attr_color) {
        let f_h = 30,
            f_w = w,
            y_span = 5;
        ctx.font = '12px Consolas';

        for (let attr in node) {
            draw_node(ctx, x, y, f_w, f_h, attr_color);
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.fillText(node[attr], x + f_w / 2, y + f_h / 2);
            y += (f_h + y_span);
        }
    }

    function visualize_mem_meta(meta, ctx) {
        let mem_block_w = ctx.canvas.width * 0.6;
        let mem_block_h = ctx.canvas.height * 0.6;
        let mem_left_margin, mem_right_margin, mem_top_margin, mem_bottom_margin;
        mem_left_margin = mem_right_margin = ctx.canvas.width * 0.2;
        mem_top_margin = mem_bottom_margin = ctx.canvas.height * 0.1;

        let mem_block_x, mem_block_y;
        mem_block_x = mem_left_margin;
        mem_block_y = mem_top_margin;

        let stack_org_x = mem_block_x;
        let stack_org_y = mem_block_y + 10; // in px
        let stacks_block_w = mem_block_w;
        let stacks_block_h = mem_block_h - 10 * 2;

        draw_block(ctx, mem_block_x, mem_block_y, mem_block_w, mem_block_h, node_body_color, color_meta.border_color);

        let address_space = parseInt(meta[meta.length - 1].topofstack, 16) - parseInt(meta[0].stack, 16);
        let unit = stacks_block_h / address_space;
        let stacks_ptr = {
            x: stack_org_x,
            y: stack_org_y,
            last_ptr: data[0].stack
        };

        let seed = getRandomInt(0, hexCode.length - 1);
        meta.forEach(({ name, stack, topofstack, priority }, i, arr) => {
            let x = stacks_ptr.x;
            let y = stacks_ptr.y + (parseInt(stack, 16) - stacks_ptr.last_ptr) * unit;
            let stack_w = stacks_block_w;
            let stack_h = (parseInt(topofstack, 16) - parseInt(stack, 16)) * unit;
            /* color of node is followed config */
            ctx.fillStyle = "rgb".concat(hexToRgbR(node_inner_color, seed));

            draw_roundRect(ctx, x, y, stack_w, stack_h, 0, true, true)
            draw_text(ctx, x - 2, y, stack, '15px Consolas', undefined, 'right');
            draw_text(ctx, x - 2, y + stack_h, topofstack, '15px Consolas', undefined, 'right')
            draw_text(ctx, x + stack_w / 2, y + stack_h / 2, name, '15px Consolas', undefined, 'center')
            stacks_ptr = {
                x: stacks_ptr.x,
                y: y + stack_h,
                last_ptr: parseInt(topofstack, 16)
            }
        })
    }



    function visualize_task_meta(metas, ctx, x, y, x_bound, x_off) {
        let node_w = 100,
            node_h = 150;
        let node_span_w = 20,
            node_span_h = 30;
        let info_x_off = 5,
            info_y_off = 5;
        let direction = 1,
            cur_pri = "-1",
            cur_idx = 0;
        /* visualize ready task & blocked task */
        metas.forEach((meta, index) => {
            let node_color = index == 0 ? node_body_color : '#E5005F';
            let attr_color = index == 0 ? node_inner_color : '#E86292';
            if (index == 1) {
                x = x_off;
                y += (node_h + node_span_h);
                direction = 1;
                cur_idx = 0;
            }
            meta.forEach(node => {
                cur_pri = (cur_pri != "-1") ? cur_pri : node["priority"];
                if (cur_pri != node["priority"]) {
                    cur_pri = node["priority"];
                    cur_idx = 0;
                    x = x_off;
                    y += (node_h + node_span_h);
                    direction = 1;
                }
                if (!(x + node_w * direction < x_bound) || !(x >= 0)) {
                    x -= ((node_w + node_span_w) * direction);
                    direction *= -1;
                    y += (node_h + node_span_h);
                    /* connect vertical */
                    draw_arrow(ctx, x + node_w / 2, y - node_span_h,
                        x + node_w / 2, y);
                    cur_idx = 0;
                }
                /* draw container of task */
                draw_node(ctx, x, y, node_w, node_h, node_color);

                /* connect node */
                if (cur_idx != 0) {
                    if (direction > 0)
                        draw_arrow(ctx, x - node_span_w,
                            y + 20, x, y + 20);
                    else
                        draw_arrow(ctx, x + node_span_w + node_w, y + 20,
                            x + node_w, y + 20);
                }
                cur_idx += 1;

                /* draw detail of per task */
                visualize_task(ctx, node, x + info_x_off, y + info_y_off, node_w - 2 * info_x_off, attr_color);

                /* update x */
                x += ((node_w + node_span_w) * direction);
            });
        });
    }

    function visualize_flist_meta(metas, ctx, x, y, x_bound, x_off) {
        let node_w = 100,
            node_h = 110;
        let node_span_w = 20,
            node_span_h = 30;
        let info_x_off = 5,
            info_y_off = 5;
        let direction = 1,
            cur_idx = 0;
        let meta = metas[1];
        let node_color = "#8BA18D";
        let attr_color = "#BAD5BC";

        let used_size = parseInt(metas[0][0]["totalHeapSize"]) - parseInt(metas[0][0]["xFreeBytesRemaining"]);
        let remain_size = parseInt(metas[0][0]["xFreeBytesRemaining"]);

        let used_color = node_body_color;
        let remain_color = "#8BA18D";

        let sum_len = 400,
            sum_height = 30;
        let use_w = sum_len * used_size / (remain_size + used_size);
        let remain_w = sum_len * remain_size / (remain_size + used_size);

        /* draw summary */
        draw_node(ctx, x, y, use_w, sum_height, used_color);
        draw_node(ctx, x + use_w, y, remain_w, sum_height, remain_color);

        /* show figure on larger part */
        let font_start, pro;
        if (use_w < remain_w) {
            font_start = use_w;
            pro = Math.round(remain_w * 100 / (remain_w + use_w));
        } else {
            font_start = x;
            pro = Math.round(use_w * 100 / (remain_w + use_w));
        }
        ctx.font = '12px Consolas';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(pro.toString() + '%', font_start + sum_len / 2, y + sum_height / 2);


        y += sum_height + 20;
        /* draw detail */
        meta.forEach(node => {
            if (!(x + node_w * direction < x_bound) || !(x >= 0)) {
                x -= ((node_w + node_span_w) * direction);
                direction *= -1;
                y += (node_h + node_span_h);
                /* connect vertical */
                draw_arrow(ctx, x + node_w / 2, y - node_span_h,
                    x + node_w / 2, y);
                cur_idx = 0;
            }
            /* draw container of task */
            draw_node(ctx, x, y, node_w, node_h, node_color);

            /* connect node */
            if (cur_idx != 0) {
                if (direction > 0)
                    draw_arrow(ctx, x - node_span_w,
                        y + 20, x, y + 20);
                else
                    draw_arrow(ctx, x + node_span_w + node_w, y + 20,
                        x + node_w, y + 20);
            }
            cur_idx += 1;

            /* draw detail of per task */
            visualize_task(ctx, node, x + info_x_off, y + info_y_off, node_w - 2 * info_x_off, attr_color);

            /* update x */
            x += ((node_w + node_span_w) * direction);
        });
    }

    // key event handling
    document.addEventListener('keypress', (event) => {
        let name = event.key;
        let code = event.code;
        // Alert the key name and key code on keydown
        if (code === 'KeyH') {
            console.log('help');
        } else if (code === 'KeyC') {
            let conf = document.querySelector('.config_panel');
            if (conf.style.display !== 'none') {
                conf.style.display = 'none';
            } else {
                conf.style.display = 'block';
            }
        } else if (code === 'KeyP') {
            if (timer_run) {
                console.log('Stop updater');
                clearInterval(task_clock);
                clearInterval(mem_clock)
                clearInterval(fl_clock);
                timer_run = false;
            } else {
                console.log('Resume updater');
                task_clock = setInterval(task_updater, 1000);
                mem_clock = setInterval(mem_updater, 1000);
                fl_clock = setInterval(fl_updater, 1000);
                timer_run = true;
            }
        }
    }, false);

    // click event handling
    let bc, lc, tc, tic;
    let tmp_bc, tmp_lc, tmp_tc, tmp_tic;

    function close_config_panel() {
        let conf = document.querySelector('.config_panel');
        conf.style.display = 'none';
    }

    function init_config_panel() {
        bc = document.querySelector('#bordercolor');
        lc = document.querySelector('#linecolor');
        tc = document.querySelector('#taskbodycolor');
        tic = document.querySelector('#taskinnercolor');
        // set default color
        tmp_bc = color_meta.border_color;
        tmp_lc = color_meta.arrow_color;
        tmp_tc = node_body_color;
        tmp_tic = node_inner_color;
        bc.setAttribute('value', color_meta.border_color);
        lc.setAttribute('value', color_meta.arrow_color);
        tc.setAttribute('value', node_body_color);
        tic.setAttribute('value', node_inner_color);
    }
    init_config_panel();

    bc.addEventListener('change', (event) => {
        color_meta.border_color = event.target.value;
    });
    lc.addEventListener('change', (event) => {
        color_meta.arrow_color = event.target.value;
    });
    tc.addEventListener('change', (event) => {
        node_body_color = event.target.value;
    });
    tic.addEventListener('change', (event) => {
        node_inner_color = event.target.value;
    });

    function restore_color() {
        color_meta.border_color = tmp_bc;
        color_meta.arrow_color = tmp_lc;
        node_body_color = tmp_tc;
        node_inner_color = tmp_tic;
    }
    document.querySelector('.apply_button').addEventListener('click', () => {
        tmp_bc = bc.value;
        tmp_lc = lc.value;
        tmp_tc = tc.value;
        tmp_tic = tic.value;
        restore_color();
        close_config_panel();
    }, false);
    document.querySelector('.cancel_button').addEventListener('click', () => {
        restore_color();
        close_config_panel();
    }, false);
}