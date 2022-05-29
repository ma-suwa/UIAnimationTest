
  function init(){
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

    const canvas = document.querySelector("canvas");
    const size = 1200;
    canvas.width = canvas.height = size;
    const padding = size/2;
    const graph = {
      x: padding/2,
      y: padding/2,
      width: canvas.width-padding,
      height: canvas.height-padding,
    }
    const point = {
      start:[graph.x,graph.height+graph.y],
      end:[graph.width+graph.x, graph.y]
    }
    const ctx = canvas.getContext("2d");
    //DOM
    let elementList = document.querySelectorAll('.item');

    // GUI
    const PARAMS = {
      cubicBezier: "0.33, 1, 0.68, 1",
      duration: 0.6,
      text: true,
      marker: false,
      rateOfChange : 70,
      secondsMarker : 0.2
    };

    const preset = {
      cubicBezier: "0.33, 2, 0.68, 2"
    };

    let cubicBezier = PARAMS.cubicBezier.split(',');//easingArray
    let duration = PARAMS.duration;

    const pane = new Tweakpane.Pane({
        expanded: true,
    });

    const easing_f = pane.addFolder({
      title: 'Easing',
    });

    const easing_tab =easing_f.addTab({
      pages: [
        {title: 'Input'},
        {title: 'Presets'},
      ]
    });

    easing_tab.pages[0].addInput(
      PARAMS, 'cubicBezier'
    );

    easing_tab.pages[1].addInput(
      PARAMS, 'cubicBezier',{
        options: {
          liner: '0.5,0.5,0.5,0.5',
          easeOut: '0,0,.58,1',
          easeOutQuad: '0.5, 1, 0.89, 1',
          easeOutCubic: '0.33, 1, 0.68, 1',
          easeOutQuint: '0.22, 1, 0.36, 1',
          easeOutExpo: '0.16, 1, 0.3, 1',
          easeOutCirc: '0, 0.55, 0.45, 1',
          easeOutBack: '0.34, 1.56, 0.64, 1'
        },
    });





    const duration_f = pane.addFolder({
      title: 'Duration',
    });
    duration_f.addInput(
      PARAMS, 'duration',
      {min: 0, max: 3, step: 0.025}
    );

    const info_f = pane.addFolder({
      title: 'Info',
    });
    info_f.addInput(PARAMS, 'text');
    info_f.addInput(PARAMS, 'marker');
    info_f.addInput(PARAMS, 'rateOfChange',
      {min: 0, max: 100, step: 2.5}
    );
    info_f.addInput(PARAMS, 'secondsMarker',
      {min: 0, max: 0.5, step: 0.05}
    );
    // info_f.addInput(PARAMS, 'rateOfChange ', {
    //   options: {
    //     medium: 0.2,
    //     fast: 0.1,
    //     quick:0.025,
    //     slow: 0.3
    //   },
    // });

    pane.on('change', (ev) => {
      graphDraw(ev);
    });

    graphDraw();



    function map (value, fromMin, fromMax, toMin, toMax){
      return (value - fromMin) / (fromMax - fromMin) * (toMax - toMin) + toMin;
    }


    function graphDraw(){

      for (let i = 0; i < elementList.length; i++) {
        let element = elementList[i];
        element.style.animationTimingFunction ="cubic-bezier("+ PARAMS.cubicBezier + ")";
        element.style.transitionTimingFunction ="cubic-bezier("+ PARAMS.cubicBezier + ")";
        console.log(PARAMS.cubicBezier);
        element.style.animationDuration = PARAMS.duration+"s";
        element.style.transitionDuration = PARAMS.duration+"s";
      }


      //setBezier
      cubicBezier = PARAMS.cubicBezier.split(',');//easingArray
      duration = PARAMS.duration;

      for(let i = 0;  i < cubicBezier.length; i++){
        if(i == 0){cubicBezier[i] = map(cubicBezier[i],0,1,0.25,0.75) * size ;}
        if(i == 1){cubicBezier[i] = size - map(cubicBezier[i],0,1,0.25,0.75)*size;}
        if(i == 2){cubicBezier[i] = map(cubicBezier[i],0,1,0.25,0.75) * size ;}
        if(i == 3){cubicBezier[i] = size - map(cubicBezier[i],0,1,0.25,0.75)*size;}
      };

      //canvasBackground
      ctx.beginPath();
      ctx.fillStyle = "#272727";
      ctx.rect(0,0,canvas.width,canvas.height);
      ctx.fill();
      ctx.closePath();

      //graphBackground
      ctx.beginPath();
      ctx.fillStyle = "#323232" ;
      ctx.rect(graph.x,graph.y,graph.width,graph.height);
      ctx.fill();
      ctx.closePath();

      //gridLines
      let gridNum = 10;
      ctx.lineWidth= 5;
      for(let i = 1; i < gridNum; i++){
        ctx.beginPath();
        ctx.moveTo(graph.x+graph.width/gridNum*i,graph.y);
        ctx.lineTo(graph.x+graph.width/gridNum*i,graph.height+graph.y);
        ctx.strokeStyle= "#393939";
        ctx.stroke();
        ctx.closePath();
      }

      //Easeing-curve
      ctx.lineWidth= 5;
      ctx.beginPath();
      ctx.moveTo(point.start[0],point.start[1]);
      ctx.bezierCurveTo(cubicBezier[0], cubicBezier[1], cubicBezier[2], cubicBezier[3], point.end[0],point.end[1]);
      ctx.strokeStyle= "#F5F5F5";
      ctx.stroke();

      //startHandle
      ctx.lineWidth= 5;

      ctx.beginPath();
      ctx.moveTo(point.start[0],point.start[1]);
      ctx.lineTo(cubicBezier[0], cubicBezier[1]);
      ctx.strokeStyle= "#FDBF28";
      ctx.stroke();  
      ctx.closePath();

      ctx.beginPath();
      ctx.arc( cubicBezier[0], cubicBezier[1], 10, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
      ctx.fillStyle= "#FDBF28";
      ctx.fill();  
      ctx.closePath();
      
      //endHandle
      ctx.lineWidth= 5;
      ctx.beginPath();
      ctx.moveTo(point.end[0],point.end[1]);
      ctx.lineTo(cubicBezier[2], cubicBezier[3]);
      ctx.strokeStyle= "#FDBF28";
      ctx.stroke();  
      ctx.closePath();

      ctx.beginPath();
      ctx.arc( cubicBezier[2], cubicBezier[3], 10, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
      ctx.fillStyle= "#FDBF28";
      ctx.fill();  
      ctx.closePath();

      if(PARAMS.marker == true){
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.rect(graph.x, graph.y-(graph.height*(PARAMS.rateOfChange/100) - graph.height),graph.width,5);
        ctx.fillStyle= "#FFFF00";
        ctx.fill();  
        ctx.closePath();
        if(PARAMS.duration > 0){
          ctx.beginPath();
          ctx.rect(graph.x+ (graph.x*2.0)*PARAMS.secondsMarker / PARAMS.duration, graph.y ,5,graph.height);//200ms~300ms
          ctx.fillStyle= "#FF0000";
          ctx.fill();  
          ctx.closePath();
        }
      }

      ctx.globalAlpha = 1;
      if(PARAMS.text == true){
        ctx.fillStyle= "#666666";
        ctx.font = '30px"GillSans"';
        ctx.textAlign = "center"
        //text 0s
        ctx.fillText("0s", point.start[0]-50, point.end[0]);
        //text xs
        ctx.fillText(String(Math.floor(PARAMS.duration*100)/100)+"s", point.start[1]+50, point.end[0]);
        //curveText
        ctx.fillStyle= "#CCCCCC";
        ctx.textAlign = "center"
        ctx.font = '45px"GillSans"';
        ctx.fillText("cubic-bezier(" + PARAMS.cubicBezier + ");", canvas.width/2,canvas.height-200 );
      }

    }

  }
    

