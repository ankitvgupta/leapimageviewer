 //This is the starting of the Leap Motion script
    var frame;
    // Global keyTap and screenTap arrays
    var keyTaps = [];
  

    var circleTimes = [];

    currentImage = 0;
    
   
    
    

    /*
      
      The leapToScene function takes a position in leap space 
      and converts it to the space in the canvas.
      
      It does this by using the interaction box, in order to 
      make sure that every part of the canvas is accesible 
      in the interaction area of the leap

    */

    function leapToScene( leapPos ){
      // This was a suggested function from the Leap Motion API
      // Gets the interaction box of the current frame
      var iBox = frame.interactionBox;

      // Gets the left border and top border of the box
      // In order to convert the position to the proper
      // location for the canvas
      var left = iBox.center[0] - iBox.size[0]/2;
      var top = iBox.center[1] + iBox.size[1]/2;

      // Takes our leap coordinates, and changes them so
      // that the origin is in the top left corner 
      var x = leapPos[0] - left;
      var y = leapPos[1] - top;

      // Divides the position by the size of the box
      // so that x and y values will range from 0 to 1
      // as they lay within the interaction box
      x /= iBox.size[0];
      y /= iBox.size[1];

      // Uses the height and width of the canvas to scale
      // the x and y coordinates in a way that they 
      // take up the entire canvas
      x *= width;
      y *= height;

      // Returns the values, making sure to negate the sign 
      // of the y coordinate, because the y basis in canvas 
      // points down instead of up
      return [ x , -y ];

    }

    function onCircle( gesture ){

      /*
      
        Setting up our parameters
      
      */

      // First get the position using our leapToScene function
      var pos = leapToScene( gesture.center );

      // Assigning the radius
      var radius = gesture.radius;

      var clockwise = false;

      if( gesture.normal[2]  <= 0 ){

        clockwise = true;

      }


    }
   


    function onSwipe( gesture ){

      // These two store the start and end positions of the gesture
      var startPos = leapToScene( gesture.startPosition );
      var pos = leapToScene( gesture.position);

      // These are the unmodified versions
      unmodstartPos = gesture.startPosition;
      unmodendPos = gesture.position;

      // This calculates the change in Y and the change in X
      unmodDeltaY = Math.abs(gesture.startPosition[1] - gesture.position[1]);
      unmodDeltaX = Math.abs(gesture.startPosition[0] - gesture.position[0]);

      // Does different actions based on if there is a greater change in Y or greater change in X
      if (unmodDeltaY > unmodDeltaX)
      {   
        if (pos[1] > startPos[1])
           $('#pan img').panZoom( 'zoomIn');
        else if(pos[1] < startPos[1])
           $('#pan img').panZoom( 'zoomOut');
      }
      else
      {  
        if(pos[0] > startPos[0])
            $('#pan img').panZoom( 'panRight');
        else if(pos[0] < startPos[0])
            $('#pan img').panZoom( 'panLeft');  
      }

    }

    // Moves to the next image in the list (currentImage is pre-updated)
    function onNextImage( gesture ){

        $('#pan img').attr('src', images[currentImage]);

    }

    // Moves to the previous image in the list (currentImage is pre-updated)
    function onPrevImage( gesture ){

        $('#pan img').attr('src', images[currentImage]);

    }

    function onRefresh( hand ){
        console.log("The number of fingers is " + hand.pointables.length);

        // If there is one finger, does the refresh.
        if(hand.pointables.length == 1)
        {
          console.log("Refreshed!");
          //$( "#destroy" ).trigger( "click" );
          //$( "#reinit" ).trigger( "click" );
          $('#pan img').panZoom( 'fit');  
        }


    }

    // If the sidebar is open, close it. If it is closed, open it.
    function onSidebar( ){
      if(sidebaropen == 0)
      {
        $( "#demo_menu3" ).mouseenter();
        $( "#demo_menu3" ).click();
        sidebaropen = 1;
      }
      else if (sidebaropen == 1)
      {
        $( "#demo_menu3" ).mouseleave();
        sidebaropen = 0;
      }
        


    }



    // Creates our Leap Controller
    var controller = new Leap.Controller({enableGestures:true});
    circleTimes.push("0");
     var firstcircle = 1;
    // Tells the controller what to do every time it sees a frame
    controller.on( 'frame' , function( data ){
   

      // Assigning the data to the global frame object
    frame = data;
    // Iterate over all of the gestures that come in
    for( var i = 0; i < frame.gestures.length; i++ ){


        
        var gesture = frame.gestures[i];
        //gestures.push(gesture.timestamp);

        // store the type of the gesture
        var type = gesture.type;

        if (frame.hands.length > 0) {
          for (var k = 0; k < frame.hands.length; k++) {
            var hand = frame.hands[k];
            var normalDirec = hand.palmNormal[1];
            console.log(hand.palmNormal);
        

            // Do different things for different numbers of fingers and gestures
            if(frame.fingers.length != 1)
            {
              switch( type ){
          
                case "circle":
                  // Deal with the case of 'fit' being called the first time
                  if(firstcircle == 1)
                  {
                    circleTimes[0] = frame.timestamp;
                    firstcircle = 0;
                    onRefresh ( hand );
                  }
                  // Ignore attempts to refresh within a second of other attempts
                  if(frame.timestamp - circleTimes[0] <= 1000000)
                  {
                    console.log("Initial time was " + circleTimes[0]);
                    console.log("Cannot refresh so soon...  " + (frame.timestamp - circleTimes[0]));
                    break;
                  }
                  else
                  {
                    circleTimes[0] = frame.timestamp; 
                    onRefresh( hand );
                  }
            
            
                case "swipe":
                  onSwipe( gesture );
                  break;
          
                case "screenTap":
                  break;

                case "keyTap":
                  if(frame.fingers.length == 3)
                  {
                    onSidebar();
                  }
                  break;

               
            
   
              }
          }
          else
          {
             switch( type ){

              case "keyTap":
                  // Change the currentImage and then call the image changer function
                  console.log("Going to next picture, " + normalDirec);
                  currentImage = (currentImage + 1) % images.length;
                  onNextImage( gesture );
                  break;

              case "screenTap":
                // Change the currentImage and then call the image changer function
                console.log("Going to previous picture, " + frame.gestures.length);
                currentImage = (currentImage + images.length - 1) % images.length;
                onPrevImage( gesture );
                break;   

              case "circle":
                if(firstcircle == 1)
                {
                  circleTimes[0] = frame.timestamp;
                  firstcircle = 0;
                  onRefresh( hand );
                }
                // Ignore cases where 'fit' is called more than once within a second
                if(frame.timestamp - circleTimes[0] <= 1000000)
                {
                  console.log("Initial time was " + circleTimes[0]);
                  console.log("Cannot refresh so soon...  " + (frame.timestamp - circleTimes[0]));
                  break;
                }
                else
                {
                    circleTimes[0] = frame.timestamp; 
                    onRefresh( hand );
                }
                
            }

          }
      
        }
      }
    }

    });
    
    // Get frames rolling by connecting the controller
    controller.connect();


    $(function() {

        var htmls = "";

        for(var g = 0; g < images.length; g++)
        {
            htmls += "<div class=\"content\"><div><a href=\"#\"><img src=\""; 
            htmls += images[g]; 
            htmls += "\" alt=\"images/";
            htmls += g+1;
            htmls += ".jpg\" class=\"thumb\" /></a></div></div>";

          
        }
        console.log(htmls);
        $(".container").html(htmls);
        $('img').bind('click', function () {
        $('#pan img').attr('src', $(this).attr('src'));
        });

        //current thumb's index being viewed
        var current     = -1;
        //cache some elements
        var $btn_thumbs = $('#fp_thumbtoggle');
        var $loader   = $('#fp_loading');
        var $btn_next   = $('#fp_next');
        var $btn_prev   = $('#fp_prev');
        var $thumbScroller  = $('#thumbScroller');
        
        //total number of thumbs
        var nmb_thumbs    = $thumbScroller.find('.content').length;
        
        //preload thumbs
        var cnt_thumbs    = 0;
        for(var i=0;i<nmb_thumbs;++i){
          var $thumb = $thumbScroller.find('.content:nth-child('+parseInt(i+1)+')');
          $('<img/>').load(function(){
            ++cnt_thumbs;
            if(cnt_thumbs == nmb_thumbs)
        //display the thumbs on the bottom of the page
        showThumbs(2000);
          }).attr('src',$thumb.find('img').attr('src'));
        }
        
        
        //make the document scrollable
        //when the the mouse is moved up/down
        //the user will be able to see the full image
        makeScrollable();
        
        //clicking on a thumb...
        $thumbScroller.find('.content').bind('click',function(e){
          var $content= $(this);
          var $elem   = $content.find('img');
          //keep track of the current clicked thumb
          //it will be used for the navigation arrows
          current   = $content.index()+1;
          //get the positions of the clicked thumb
          var pos_left  = $elem.offset().left;
          var pos_top   = $elem.offset().top;
          //clone the thumb and place
          //the clone on the top of it
          
          
          var windowW = $(window).width();
          var windowH = $(window).height();
          //animate the clone to the center of the page
          $clone.stop()
          .animate({
            'left': windowW/2 + 'px',
            'top': windowH/2 + 'px',
            'margin-left' :-$clone.width()/2 -5 + 'px',
            'margin-top': -$clone.height()/2 -5 + 'px'
          },500,
          function(){
            var $theClone   = $(this);
            var ratio   = $clone.width()/120;
            var final_w   = 400*ratio;
            
            
          
            
            
            //expand the clone when large image is loaded
            $('<img class="fp_preview"/>').load(function(){
              var $newimg     = $(this);
              var $currImage  = $('#fp_gallery').children('img:first');
              $newimg.insertBefore($currImage);

              //expand clone
              $theClone.animate({
                'opacity'   : 0,
                'top'     : windowH/2 + 'px',
                'left'      : windowW/2 + 'px',
                'margin-top'  : '-200px',
                'margin-left' : -final_w/2 + 'px',
                'width'     : final_w + 'px',
                'height'    : '400px'
              },1000,function(){$(this).remove();});
              //now we have two large images on the page
              //fadeOut the old one so that the new one gets shown
              $currImage.fadeOut(2000,function(){
                $(this).remove();
              });
              //show the navigation arrows
              showNav();
            }).attr('src',$elem.attr('alt'));
          });
          //hide the thumbs container
          hideThumbs();
          e.preventDefault();
        });
        
        //clicking on the "show thumbs"
        //displays the thumbs container and hides
        //the navigation arrows
        $btn_thumbs.bind('click',function(){
          showThumbs(500);
          hideNav();
        });
        
        function hideThumbs(){
          $('#outer_container').stop().animate({'bottom':'-160px'},500);
          showThumbsBtn();
        }

        function showThumbs(speed){
          $('#outer_container').stop().animate({'bottom':'0px'},speed);
          hideThumbsBtn();
        }
        
        function hideThumbsBtn(){
          $btn_thumbs.stop().animate({'bottom':'-50px'},500);
        }

        function showThumbsBtn(){
          $btn_thumbs.stop().animate({'bottom':'0px'},500);
        }

        function hideNav(){
          $btn_next.stop().animate({'right':'-50px'},500);
          $btn_prev.stop().animate({'left':'-50px'},500);
        }

        function showNav(){
          $btn_next.stop().animate({'right':'0px'},500);
          $btn_prev.stop().animate({'left':'0px'},500);
        }

        //events for navigating through the set of images
        $btn_next.bind('click',showNext);
        $btn_prev.bind('click',showPrev);
        
        //the aim is to load the new image,
        //place it before the old one and fadeOut the old one
        //we use the current variable to keep track which
        //image comes next / before
        function showNext(){
          ++current;
          var $e_next = $thumbScroller.find('.content:nth-child('+current+')');
          if($e_next.length == 0){
            current = 1;
            $e_next = $thumbScroller.find('.content:nth-child('+current+')');
          }
          
        }
        
        function showPrev(){
          --current;
          var $e_next = $thumbScroller.find('.content:nth-child('+current+')');
          if($e_next.length == 0){
            current = nmb_thumbs;
            $e_next = $thumbScroller.find('.content:nth-child('+current+')');
          }
        
        }
        
                function makeScrollable(){
          $(document).bind('mousemove',function(e){
            var top = (e.pageY - $(document).scrollTop()/2) ;
            $(document).scrollTop(top);
                    });
        }});
          
