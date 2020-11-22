//Declaration of variables related to model and video feed
let video;
let handpose;
let handPoses;
let handPose;
let handConfidence;
let lastGesture = "middle";
let THRESHOLD = 0.80;


//Declaration of variables related to image loading
let imageArray = [];
let counter = 3;
let imageIndex = 0;
let currentImage;
let birdy;
let benzene;
let molecules;
let noImage = true;
let pastX;
let pastY;

//Preloaded set of images for demonstration purposes, but users can drag and drop their own content/images on top of canvas for use
function preload() {
    birdy = loadImage("images/birdy.png");
    benzene = loadImage("images/benzene.png");
    molecules = loadImage("images/molecules.gif");
    fredrick = loadImage("images/fredrick.jpeg");
    orbital = loadImage("images/orbital.gif");

    imageArray = [fredrick, molecules, orbital];
}

function setup() {
    
    let canvas = createCanvas(640, 480);
    background(0);

    video = createCapture(VIDEO);
    video.hide();

    canvas.drop(gotFile);

    //Initilization of handpose machine learning model, imported from Tensorflow.js port
    handpose = ml5.handpose(video, ()=> console.log("HandPose model has successfully initialized."));

    handpose.on("predict", gotHandPoses);
}

function imageStay(){
    // checks variable value
    // if input is -1
    // display no image
    // if in
    console.log("function called")
    if (noImage){
        // don't display an image;
        return;
    } else {
        imageMode(CENTER);
        image(imageArray[imageIndex], lastX, lastY);
        imageMode(CORNER);

    }
}

function gotHandPoses(results) {
    handPoses = results;
    // console.log("hand pose")
    // console.log(handPoses);

    if (handPoses.length > 0) {
        handPose = handPoses[0].annotations;
        handConfidence = handPoses[0].handInViewConfidence;
    }
}


//Interface to receive and integrate files dropped on top of canvas
function gotFile(file) {
    let img = createImg(file.data);
    img.hide();
    imageArray[counter] = img;
    counter++;
}

function draw() {
    image(video, 0, 0);

    if (handPose) {
        thumbBase(30);
        pinkyUp(); // previous image
        indexUp(); //show iamge
        thumbUp();
        middleUp();
       // spiderMan();
   //     console.log(handConfidence);
      //  console.log(handPoses);
    } else{
       // noImage = true;
        console.log("missing Hand")
    }    
}


//Algorithms for gesture detection
    function pinkyUp(){
        if(handPose.pinky[3] && handConfidence > THRESHOLD){
            // checking if up
            
            fill(0, 0, 255);
            noStroke();
            //ellipse(handPose.pinky[3][0], handPose.pinky[3][1], 30, 30);
            if(tallest(handPose.pinky[3])){
              //  console.log("pinky is up");
            // imageMode(CENTER);
            // imageMode(CORNER);
             
                lastGesture = "pinky";
                return true;;
            }
        }
        return false;
    }

    function indexUp(){
        if(handPose.indexFinger[3] && handConfidence > THRESHOLD){
            // checking if up
            
            fill(0, 255, 0);
            noStroke();
            //ellipse(handPose.indexFinger[3][0], handPose.indexFinger[3][1], 30, 30);
            if(tallest(handPose.indexFinger[3])){
               // console.log("index is up");
                lastGesture = "index";
                // pastX = handPose.indexFinger[3][0];
                // pastY = handPose.indexFinger[3][1];
                imageMode(CENTER);
                image(imageArray[imageIndex], handPose.indexFinger[3][0], handPose.indexFinger[3][1]);
                imageMode(CORNER);
                return true;;
            }
        }
        return false;
    }

    function middleUp(){
        if(handPose.middleFinger[3] && handConfidence > THRESHOLD){
            // checking if up
            
            fill(255, 0, 0);
            noStroke();
            //ellipse(handPose.middleFinger[3][0], handPose.middleFinger[3][1], 30, 30);
            if(tallest(handPose.middleFinger[3])){
               // console.log("middle is up");
                action();
                imageStay();
                return true;;
            }
        }
        return false;
    }

    function action(){
       // this function will call things depending on the last gesture
       // console.log(lastGesture);
        if(lastGesture === "index"){
            // TODO: index action
            //  noImage = false;
            console.log("index action"); // iamge follows you around
        } else if (lastGesture === "thumb"){
            // Thumb action goes to next image
            if(imageIndex == imageArray.length -1){
                console.log("Already at last image")
            } else {
                imageIndex++;
            }
            console.log("thumb action");
        } else if (lastGesture === "pinky"){
            // pinky action goes to previous image
            console.log("pinky action");
            if(imageIndex ==0){
                console.log("Already at first image")
            } else {
                imageIndex--;
            }
        }else if (lastGesture === "spiderMan"){
            noImage = !noImage;
            console.log("spiderMan action"); // flips an image on and off
        }
        else{
            // NO ACTION
            //  console.log("no Action")
        }
        lastGesture = "middle";
        
    }
    
    //Spiderman gesture for displaying image
    function spiderMan(){
        if( handPose.indexFinger[3] && handConfidence > THRESHOLD && tallest(handPose.indexFinger[3])){
            
            if(handPose.pinky[3]){
                if(handPose.pinky[3][1] < handPose.middleFinger[3][1] && handPose.pinky[3][1] < handPose.ringFinger[3][1]){
                    pastX = handPose.indexFinger[3][0];
                    pastY = handPose.indexFinger[3][1];
                    lastGesture = "spiderMan";
                    return true;
                }
            }
        }
        return false;
    }

    function thumbUp(){
        if(handPose.thumb[3] && handConfidence > THRESHOLD){
            // checking if up
            
            fill(255, 0, 255);
            noStroke();
            //ellipse(handPose.thumb[3][0], handPose.thumb[3][1], 30, 30);
            if(tallest(handPose.thumb[3])){
                //console.log("thumb is up");
                lastGesture = "thumb";
                return true;
            }
        }
        return false;
    }

    

    function tallest(input){
        // Code for troubleshooting issues with gesture recognition algorithms
        // console.log("thumb: "+ handPose.thumb[3][1]);
        // console.log("index: "+ handPose.indexFinger[3][1]);
        // console.log("middle: "+ handPose.middleFinger[3][1]);
        // console.log("ring: "+ handPose.ringFinger[3][1]);
        // console.log("pinky: "+ handPose.pinky[3][1]);
        
        if(input[1] <= handPose.thumb[3][1] && input[1] <= handPose.indexFinger[3][1] && input[1] <= handPose.middleFinger[3][1] && input[1] <= handPose.ringFinger[3][1] && input[1] <= handPose.pinky[3][1]){
            return true;
        } else {
            return false;
        }
    }


function thumbBase(r) {
    if (handPose.thumb[0] && handConfidence > .80) {
     // console.log(handConfidence);
        fill(0, 0, 255);
        noStroke();
    //  ellipse(handPose.thumb[0][0], handPose.thumb[0][1], r, r)
    }
}

function thumbFinger(r) {
    if (handPose.thumb[3] && handConfidence > .80) {
        fill(255, 0, 0);
        noStroke();
   //   ellipse(handPose.thumb[3][0], handPose.thumb[3][1], r, r);
    }
}


