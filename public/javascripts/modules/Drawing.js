define(['lib/jquery'], function($) {
    function Drawing(paper) {
        var self = this,
            startRecording,
            x, y,
            pts = [],
            attr = '';

        self.g = newSVG('path');
        baseStyle(self.g);

        paper.addEventListener('mousedown', beginDraw, false);
        paper.addEventListener('mouseup', endDraw, false);
        paper.addEventListener('mousemove', function(e){
            x = e.offsetX;
            y = e.offsetY;
        }, false);

        function beginDraw(e){
            pts.push({attr: "M ", x: e.offsetX, y: e.offsetY});
            attr += "M " + e.offsetX + " " + e.offsetY;
            self.g.setAttributeNS(null,"d", attr);
            paper.appendChild(self.g);
            startRecording = setInterval(record, 16);
        }
        function endDraw(e){
            clearInterval(startRecording)
            paper.removeEventListener('mousedown', beginDraw);
        }
        function record(){
            pts.push({attr: " L ", x:x, y:y});
            attr += " L " + x + " " + y;
            self.g.setAttributeNS(null,"d", attr);
        }

        this.makeCircle = function(){
            var left = 1000000, right = 0, top = 1000000, bottom = 0, x, y, r;
            paper.removeChild(self.g);
            self.g = newSVG('circle');
            baseStyle(self.g);
            _.each(pts, function(pt){
                if(pt.x < left) left = pt.x;
                if(pt.x > right) right = pt.x;
                if(pt.y < top) top = pt.y;
                if(pt.y > bottom) bottom = pt.y;
            });
            x = ((right - left) / 2) + left;
            y = ((bottom - top) / 2) + top;
            r = ( ((right - left)/2) + ((bottom - top)/2) ) / 2;
            self.g.setAttributeNS(null,"cx", x);
            self.g.setAttributeNS(null,"cy", y);
            self.g.setAttributeNS(null,"r", r);
            paper.appendChild(self.g);
        }

        this.makeRect = function(){
            var left = 1000,right = 0,top = 10000,bottom = 0, width, height;
            paper.removeChild(self.g);
            self.g = newSVG('rect');
            baseStyle(self.g);
            _.each(pts, function(pt){
                if(pt.x < left) left = pt.x;
                if(pt.x > right) right = pt.x;
                if(pt.y < top) top = pt.y;
                if(pt.y > bottom) bottom = pt.y;
            });
            width = right - left;
            height = bottom - top;
            self.g.setAttributeNS(null,"x", left);
            self.g.setAttributeNS(null,"y", top);
            self.g.setAttributeNS(null,"width", width);
            self.g.setAttributeNS(null,"height", height);
            paper.appendChild(self.g);
        }

        this.undoDrawing = function(){
            paper.removeChild(self.g);
        }

        function baseStyle(el){
            el.setAttributeNS(null,"stroke","black");
            el.setAttributeNS(null,"fill","none");
            el.setAttributeNS(null,"stroke-width","3");
        }

        function newSVG(type){
            return document.createElementNS("http://www.w3.org/2000/svg", type);
        }
    }

    return Drawing;

});