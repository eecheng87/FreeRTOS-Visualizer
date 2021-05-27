function readTextFile(file)
{
    let rawFile = new XMLHttpRequest();
    let allText;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}
function parse_task_meta(meta, info){
    let meta_index = 0, zero = 0;
    let lines = info.split("\n");
    lines.forEach(line => {
        if(line[0] == '0'){
            zero += 1;
            return;
        }
        if(line[0] == 'x'){
            meta_index += 1;
            return;
        }
        obj = new Object();
        items = line.split(";");
        items.forEach(item => {
            obj[item.split("=")[0]] = item.split("=")[1];
        });
        filed = meta[meta_index].push(obj);
    });
}
function visualize_task(ctx, node, x, y, w){
    let f_h = 30, f_w = w, y_span = 5;
    let attr_color = '#5894D7';
    ctx.font = '10px Consolas';

    for(let attr in node){
        draw_node(ctx, x, y, f_w, f_h, attr_color);
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(node[attr], x + f_w / 2, y + f_h / 2);
        y += (f_h + y_span);
    }
}
function visualize_task_meta(meta, ctx, x, y, x_bound, x_off){
    let node_color = '#33BBFF';
    let node_w = 100, node_h = 150;
    let node_span_w = 20, node_span_h = 30;
    let info_x_off = 5, info_y_off = 5;
    let direction = 1, cur_pri = "-1", cur_idx = 0;

    /* visualize task ready */
    meta[0].forEach((node, index) => {
        cur_pri = (cur_pri != "-1") ? cur_pri : node["priority"];
        if(cur_pri != node["priority"]){
            cur_pri = node["priority"];
            cur_idx = 0;
            x = x_off;
            y += (node_h + node_span_h);
            direction = 1;
        }
        if(!(x + node_w * direction < x_bound) || !(x >= 0)){
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
        if(cur_idx != 0){
            if(direction > 0)
                draw_arrow(ctx, x - node_span_w,
                    y + 20, x, y + 20);
            else
                draw_arrow(ctx, x + node_span_w + node_w, y + 20,
                    x + node_w, y + 20);
        }
        cur_idx += 1;

        /* draw detail of per task */
        visualize_task(ctx, node, x + info_x_off, y + info_y_off, node_w - 2 * info_x_off);

        /* update x */
        x += ((node_w + node_span_w) * direction);
    });

    /* draw barrier */

    /* visualize task blocked */
}
