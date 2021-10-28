var MorphLines = MorphLines || {};

MorphLines.imageSet = {};
MorphLines.pointSet = {};
MorphLines.undo     = [];
MorphLines.ballRadius = 6;

MorphLines.reDrawSingleFigure = function( canvasId, ballColor ) {
    let canvas = document.getElementById(canvasId);
    let context = canvas.getContext('2d');
    context.clearRect( 0, 0, canvas.width, canvas.height );
    context.drawImage( this.imageSet[canvasId], 0, 0 );

    for ( let i = 0; i < this.pointSet[canvasId].length; i++ )
    {
        let canvasX = this.pointSet[canvasId][i].x;
        let canvasY = this.pointSet[canvasId][i].y;

        if ( i % 2 == 1 ) {
            // line
            context.beginPath();
            context.moveTo(  this.pointSet[canvasId][i  ].x,
                             this.pointSet[canvasId][i  ].y);
            context.lineTo(  this.pointSet[canvasId][i-1].x,
                             this.pointSet[canvasId][i-1].y);
            context.lineWidth = 2;
            context.strokeStyle = ballColor;
            context.stroke();

            context.fillStyle = 'white';
            context.fillText( Math.floor(i/2)+1, this.pointSet[canvasId][i-1].x-3, this.pointSet[canvasId][i-1].y+3);

            // hollow ball
            context.beginPath();
            context.arc( canvasX, canvasY, this.ballRadius, 0, Math.PI*2, true );
            context.strokeStyle = ballColor;
            context.stroke();
        } else {
            // solid
            context.beginPath();
            context.arc( canvasX, canvasY, this.ballRadius, 0, Math.PI*2, true );
            context.fillStyle = ballColor;
            context.fill();

            context.fillStyle = 'white';
            context.fillText( Math.floor(i/2)+1, canvasX-3, canvasY+3 )
        }
    }
};

MorphLines.reDrawFigures =  function () {
    if ('initial' in MorphLines.imageSet ) {
        this.reDrawSingleFigure( 'initial', 'blue' );
    }
    if ('final' in MorphLines.imageSet ) {
        this.reDrawSingleFigure( 'final', 'blue' );
    }
};

// for undo button
MorphLines.pushStates = function() {
    let json = JSON.stringify( MorphLines.pointSet );
    MorphLines.undo.push(json);
};

// for undo button
MorphLines.popStates = function() {
    if (MorphLines.undo.length < 2) {
        alert("no more undo steps available");
    } else {
        let trash = MorphLines.undo.pop();
        let json = MorphLines.undo[MorphLines.undo.length-1];

        MorphLines.pointSet = JSON.parse( json );
        MorphLines.reDrawFigures();
        MorphLines.getJSON();
    }
};

MorphLines.loadImage = function ( canvasId, imageName, ballColor ) {
    let image = document.createElement("img");
    image.onload = function() {
        MorphLines.imageSet[canvasId] = image;

        let canvas = document.getElementById(canvasId);
        canvas.height = image.height;
        canvas.width  = image.width;
        let context = canvas.getContext('2d');
        context.drawImage( image, 0, 0 );

        let controlRange = MorphLines.ballRadius * MorphLines.ballRadius;
        let controlC = -1;

        canvas.addEventListener("mousedown", function( event ) {
            let canvasX, canvasY;
            let offset = canvas.getBoundingClientRect();
            canvasX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(offset.left) - 1;
            canvasY = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop - Math.floor(offset.top);

            for ( let i = 0; i < MorphLines.pointSet[canvasId].length; i++ ) {
                let dis = (canvasX - MorphLines.pointSet[canvasId][i].x)*(canvasX - MorphLines.pointSet[canvasId][i].x)
                        + (canvasY - MorphLines.pointSet[canvasId][i].y)*(canvasY - MorphLines.pointSet[canvasId][i].y);

                if( dis < controlRange ) {
                    controlC = i;
                }
            }
            if ( controlC == -1 ) {
                MorphLines.pointSet[canvasId].push({ x:canvasX, y:canvasY });
                controlC = MorphLines.pointSet[canvasId].length - 1;
            }

            MorphLines.reDrawFigures();
            MorphLines.getJSON();
        });

        canvas.addEventListener( "mousemove", function( event )
        {
            if ( controlC >= 0 ) {
                let canvasX, canvasY;
                let offset = canvas.getBoundingClientRect();
                canvasX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
                        - Math.floor(offset.left) - 1;
                canvasY = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop
                        - Math.floor(offset.top);
                MorphLines.pointSet[canvasId][controlC].x = canvasX;
                MorphLines.pointSet[canvasId][controlC].y = canvasY;

                MorphLines.reDrawFigures();
                MorphLines.getJSON();
            }
        });
        canvas.addEventListener( "mouseup", function( event ) {
            controlC = -1;
            MorphLines.pushStates();
        } );

        MorphLines.reDrawFigures();
        MorphLines.getJSON();
    };
    image.src = 'images/' + imageName;
};

MorphLines.getJSON = function () {
    let len = Math.min( this.pointSet.initial.length, this.pointSet.final.length );
    len = Math.floor( len / 2 );
    if ( len == 0 ) { return; }

    let lines = {};
    lines.initial = [];
    lines.final = [];
    for ( let i = 0; i < len; i++ ) {
        lines.initial[i] = {
            x0: this.pointSet.initial[i*2  ].y,
            y0: this.pointSet.initial[i*2  ].x,
            x1: this.pointSet.initial[i*2+1].y,
            y1: this.pointSet.initial[i*2+1].x,
        }
        lines.final[i] = {
            x0: this.pointSet.final[i*2  ].y,
            y0: this.pointSet.final[i*2  ].x,
            x1: this.pointSet.final[i*2+1].y,
            y1: this.pointSet.final[i*2+1].x,
        };
    }

    let json = JSON.stringify( lines );
    let data = "text/json;charset=utf-8," + encodeURIComponent(json);

    let downloadZone = document.getElementById('download');
    downloadZone.innerHTML = '<a href="data:' + data + '" download="marker.json"><button>Download JSON</button></a>';
};

window.onload = function() {
    let button = document.getElementById('undo');
    button.onclick = function () {
        MorphLines.popStates();
    };

    // hardcoding
    let img0 = unescape( Parser.commands[0].args[0]).replace('+', ' ');
    let img1 = unescape( Parser.commands[1].args[0]).replace('+', ' ');

    MorphLines.pointSet.initial = [];
    MorphLines.pointSet.final   = [];

    if (Parser.commands[2].name == "marker") {
        let markerFile = Parser.commands[2].args[0];
        let marker = Parser.parseJson( markerFile );

        for ( let i = 0; i < marker.initial.length; i++ ) {
            MorphLines.pointSet.initial.push( {x:marker.initial[i].y0, y:marker.initial[i].x0} );
            MorphLines.pointSet.initial.push( {x:marker.initial[i].y1, y:marker.initial[i].x1} );

            MorphLines.pointSet.final.push( {x:marker.final[i].y0, y:marker.final[i].x0} );
            MorphLines.pointSet.final.push( {x:marker.final[i].y1, y:marker.final[i].x1} );
        }
    }

    MorphLines.loadImage( 'initial', img0, 'blue');
    MorphLines.loadImage( 'final'  , img1, 'blue');

    MorphLines.pushStates();
};
