function Drawing(paper) {
    var self = this,
        startRecording,
        g = newSVG('path'),
        x,y,
        pts = [],
        attr = '',
        bGrabbing = false;

    g.setAttributeNS(null,"stroke","black");
    g.setAttributeNS(null,"fill","none");
    g.setAttributeNS(null,"stroke-width","3");

    paper.addEventListener('mousedown', beginDraw, false);
    paper.addEventListener('mouseup', endDraw, false);
    paper.addEventListener('mousemove', function(e){
        x = e.offsetX;
        y = e.offsetY;
    }, false);


    function beginDraw(e){
        if(!bGrabbing){
            attr += "M " + e.offsetX + " " + e.offsetY;
            g.setAttributeNS(null,"d", attr);
            paper.appendChild(g);
            startRecording = setInterval(record, 16);
        }
    }
    function endDraw(e){
        clearInterval(startRecording)
        paper.removeEventListener('mousedown', beginDraw);
    }
    function record(){
        attr += " L " + x + " " + y;
        g.setAttributeNS(null,"d", attr);
    }


    g.addEventListener('mousedown', function(){
    //    console.log('down')
    }, false);

    g.addEventListener('mouseup', function(){
    //    console.log('up')
    }, false);

    function newSVG(type){
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }
}






