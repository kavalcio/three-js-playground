import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';

const BASE_HEIGHT = 70;
const BASE_RADIUS = 2;
const BRANCH_ANGLE = 60;
const BRANCHES_PER_LEVEL = 3;
const RECURSION_DEPTH = 5;
const ROTATION_SPEED = 0.001;
const BRANCH_SHRINK_RATE = 0.7;

export const init = (root) => {
  const params = {
    baseHeight:
      BASE_HEIGHT /* Base cylinder height of a branch, shrinks as recursion gets deeper */,
    baseRadius:
      BASE_RADIUS /* Base cylinder radius of a branch, shrinks as recursion gets deeper */,
    branchAngle: BRANCH_ANGLE /* Angle between each child and parent branch */,
    branchesPerLevel:
      BRANCHES_PER_LEVEL /* Number of children generated per parent branch */,
    recursionDepth:
      RECURSION_DEPTH /* Max recursion depth allowed when generating tree */,
    branchShrinkRate:
      BRANCH_SHRINK_RATE /* Factor by which branches shrink as you move up recursion levels */,
  };
  const paramsToApply = { ...params };

  const dynamicParams = {
    rotationSpeed:
      ROTATION_SPEED /* Speed at which each branch rotates around its parent branch */,
  };

  const applyParams = () =>
    Object.keys(paramsToApply).forEach(
      (key) => (params[key] = paramsToApply[key]),
    );

  const { scene, renderer, camera, gui, stats } = initializeScene({ root });

  camera.position.z = 200;

  // Create lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xdddddd, 3);
  directionalLight.position.set(1, 0, 1);
  scene.add(directionalLight);
  const directionalLight2 = new THREE.DirectionalLight(0xdddddd, 4);
  directionalLight2.position.set(-1, 1, 1);
  scene.add(directionalLight2);

  // Initialize tree geometry and material
  let branchGeometry = new THREE.CylinderGeometry(
    params.baseRadius,
    params.baseRadius,
    params.baseHeight,
    5,
  );
  const branchMaterial = new THREE.MeshPhongMaterial({ color: 0xbbbbbb });
  const branchHoverMaterial = new THREE.MeshPhongMaterial({ color: 0xbb2200 });

  // Recursive function that creates branches as children of a parent branch
  const createBranch = (parent, depth) => {
    if (depth > params.recursionDepth) return;

    const branch = new THREE.Mesh(branchGeometry, branchMaterial);
    branch.scale.set(
      params.branchShrinkRate,
      params.branchShrinkRate,
      params.branchShrinkRate,
    );

    // Skip rotation and translation for first branch so that it's straight up
    if (depth > 0) {
      // Rotate branch around parent randomly
      branch.rotateOnAxis(
        new THREE.Vector3(0, 1, 0),
        2 * Math.random() * Math.PI,
      );

      // Put branch at a 60 degree offset from parent
      branch.rotateOnAxis(
        new THREE.Vector3(0, 0, 1),
        (params.branchAngle * Math.PI) / 180,
      );

      // Set branch position
      branch.position.y = params.baseHeight * (Math.random() - 0.5);
      branch.translateOnAxis(
        new THREE.Vector3(0, 1, 0),
        (params.baseHeight * branch.scale.y) / 2,
      );
    }

    parent.add(branch);

    // Recursively create more branches
    for (let i = 0; i < params.branchesPerLevel; i++) {
      createBranch(branch, depth + 1);
    }
  };

  // Function that creates a tree and returns the root
  const createTree = () => {
    const root = new THREE.Object3D();
    root.position.y = -params.baseHeight / 4;
    scene.add(root);

    createBranch(root, 0);
    return root;
  };

  let tree = createTree();

  // Function that rotates branches over time
  const animationRotationAxis = new THREE.Vector3(0, 1, 0);
  const rotateBranch = (branch, angle) => {
    if (!branch) return;
    branch.rotateOnAxis(animationRotationAxis, angle);
    // Recursively rotate children
    branch.children.forEach((child) => {
      rotateBranch(child, angle);
    });
  };

  // Create GUI
  gui.width = 300;
  const resetScene = () => {
    applyParams();
    branchGeometry = new THREE.CylinderGeometry(
      params.baseRadius,
      params.baseRadius,
      params.baseHeight,
      5,
    );

    scene.remove(tree);
    tree = createTree();
  };
  const treeGuiFolder = gui.addFolder('Tree Params');
  treeGuiFolder.add(paramsToApply, 'baseHeight', 30, 100, 1);
  treeGuiFolder.add(paramsToApply, 'baseRadius', 1, 5, 0.1);
  treeGuiFolder.add(paramsToApply, 'branchAngle', 0, 90, 1);
  treeGuiFolder.add(paramsToApply, 'branchesPerLevel', 1, 5, 1);
  treeGuiFolder.add(paramsToApply, 'recursionDepth', 1, 8, 1);
  treeGuiFolder.add(paramsToApply, 'branchShrinkRate', 0.5, 0.9, 0.1);
  treeGuiFolder.add({ 'Regenerate Tree': resetScene }, 'Regenerate Tree');
  treeGuiFolder.open();
  const animationGuiFolder = gui.addFolder('Animation Params');
  animationGuiFolder.add(dynamicParams, 'rotationSpeed', 0, 0.01);
  animationGuiFolder.open();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let hovered = null;

  const onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  };

  // Create new child branch when a branch is left clicked
  const onBranchClick = () => {
    const [intersect] = raycaster.intersectObjects(scene.children) || [];
    if (intersect) {
      createBranch(intersect.object, params.recursionDepth);
    }
  };

  // Delete branch when a branch is right clicked
  const onBranchRightClick = () => {
    const [intersect] = raycaster.intersectObjects(scene.children) || [];
    if (intersect) {
      intersect.object.parent.remove(intersect.object);
    }
  };

  const checkBranchHover = () => {
    const [intersect] = raycaster.intersectObjects(scene.children) || [];
    if (hovered) {
      if (intersect?.object?.uuid !== hovered.object.uuid) {
        hovered.object.material = branchMaterial;
      }
    }

    if (intersect) {
      intersect.object.material = branchHoverMaterial;
      hovered = intersect;
    }
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onBranchClick);
  window.addEventListener('contextmenu', onBranchRightClick);

  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    rotateBranch(tree.children[0], dynamicParams.rotationSpeed);

    checkBranchHover();

    stats.end();
    renderer.render(scene, camera);
  }

  animate();
};
