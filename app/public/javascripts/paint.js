/* fondamental painting function */
function draw_node(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function draw_arrow(ctx, fromx, fromy, tox, toy) {
    let headlen = 10;
    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}
