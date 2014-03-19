define(['lib/jquery'], function($) {
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

        paper.on('mousedown', beginDraw);
        paper.on('mouseup', endDraw);
        paper.on('mousemove', function(e){
            x = e.offsetX;
            y = e.offsetY;
        });


        function beginDraw(e){
            if(!bGrabbing){
                attr += "M " + e.offsetX + " " + e.offsetY;
                g.setAttributeNS(null,"d", attr);
                paper.append(g);
                startRecording = setInterval(record, 16);
            } else {

            }
        }
        function endDraw(e){
            clearInterval(startRecording)
            paper.off('mousedown');
        }
        function record(){
            attr += " L " + x + " " + y;
            g.setAttributeNS(null,"d", attr);
        }

        g.addEventListener('mousedown', function(){
           console.log('down')
           console.log(this)
           bGrabbing = true;
        }, false);

        g.addEventListener('mouseup', function(){
           console.log('up')

           bGrabbing = false;
        }, false);

        function newSVG(type){
            return document.createElementNS("http://www.w3.org/2000/svg", type);
        }
    }

    return Drawing;


});