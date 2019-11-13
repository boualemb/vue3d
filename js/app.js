var camera, scene, renderer, controls,loader;
var mesh;
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 50;
    camera.position.x = 50;
    
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.8 );
    scene.add( ambientLight );
    loadModel();
    
    controls.update();
    scene.background = new THREE.Color( 0x222222 );
    
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    document.body.appendChild( renderer.domElement );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
     //mesh.rotation.x += 0.005;
     //mesh.rotation.y += 0.01;
    controls.update();
    renderer.render( scene, camera );
}

function frameArea(factorSizeToFitOnScreen, camera) {

    const box = new THREE.Box3().setFromObject(scene);
    const boxSize = box.getSize(new THREE.Vector3()).length();

    const boxCenter = box.getCenter(new THREE.Vector3());

    var sizeToFitOnScreen = factorSizeToFitOnScreen * boxSize;
    // set the camera to frame the box
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.Math.degToRad(camera.fov * .5);
    const distance = 2*halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 5;
    camera.far = boxSize * 5;

    camera.updateProjectionMatrix();
    
    // point the camera to look at the center of the box
   // camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    controls.target.set(boxCenter.x, boxCenter.y, boxCenter.z);
    //console.log(camera.position, ',  ', boxCenter);
    controls.minDistance = 0.8 * boxSize;
    controls.maxDistance = 5.0 * boxSize;


  }
function loadModel()
{
    loader = new THREE.GLTFLoader();
    loader.load(model,
        function ( gltf ) {
            mesh = gltf.scene; // THREE.Scene
            scene.add( gltf.scene );
            //gltf.animations; // Array<THREE.AnimationClip>

            //gltf.scenes; // Array<THREE.Scene>
           // gltf.cameras; // Array<THREE.Camera>
           // gltf.asset; // Object
            frameArea(0.8, camera);
            },
            // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
        function ( error ) {

            console.log( 'An error happened : ' +error );


            }
    );
}