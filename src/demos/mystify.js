import * as THREE from 'three';

import { getRandomColor } from 'src/utils/misc';
import { initializeScene } from 'src/utils/template';

const WIDTH = 120;
const HEIGHT = 80;

const ECHO_COUNT = 15;
const VERTEX_COUNT = 5;
const POLYGON_COUNT = 2;
const SPEED = 0.8;
const UNIFORM_COLOR = false;

const init = (root) => {
  let polygons = [];

  let params = {
    echoCount: ECHO_COUNT,
    vertexCount: VERTEX_COUNT,
    polygonCount: POLYGON_COUNT,
    speed: SPEED,
    uniformColor: UNIFORM_COLOR,
  };

  let paramsToApply = { ...params };

  const { scene, renderer, camera, gui, stats } = initializeScene({ root });

  camera.position.z = 70;
  camera.fov = 65;
  camera.updateProjectionMatrix();

  const resetScene = () => {
    while (polygons.length) {
      const polygon = polygons.pop();
      polygon.echoes.forEach((echo) => {
        echo.forEach((edge) => {
          scene.remove(edge);
        });
      });
    }
    params = { ...paramsToApply };
    uniformMaterial = new THREE.LineBasicMaterial({ color: getRandomColor() });
    polygons = createPolygons();
  };
  gui.add(paramsToApply, 'echoCount', 1, 50, 1);
  gui.add(paramsToApply, 'vertexCount', 3, 50, 1);
  gui.add(paramsToApply, 'polygonCount', 1, 15, 1);
  gui.add(paramsToApply, 'speed', 0, 3);
  gui.add(paramsToApply, 'uniformColor');
  gui.add({ 'Apply Params': resetScene }, 'Apply Params');

  // Create lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Bounding box
  const boundingBox = new THREE.Box2(
    new THREE.Vector2(-WIDTH / 2, -HEIGHT / 2),
    new THREE.Vector2(WIDTH / 2, HEIGHT / 2),
  );
  // const boxPlane = new THREE.PlaneGeometry(WIDTH, HEIGHT);
  // const boxEdges = new THREE.EdgesGeometry(boxPlane);
  // const lineMaterial = new THREE.LineBasicMaterial({ color: '#ff0000' });
  // const line = new THREE.LineSegments(boxEdges, lineMaterial);
  // scene.add(line);

  let uniformMaterial = new THREE.LineBasicMaterial({
    color: getRandomColor(),
  });

  const createPolygon = () => {
    const vertices = [];
    for (let i = 0; i < params.vertexCount; i++) {
      vertices.push({
        position: new THREE.Vector2(
          Math.random() * WIDTH - WIDTH / 2,
          Math.random() * HEIGHT - HEIGHT / 2,
        ),
        velocity: new THREE.Vector2(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        ).normalize(),
      });
    }
    const material = params.uniformColor
      ? uniformMaterial
      : new THREE.LineBasicMaterial({ color: getRandomColor() });
    return {
      vertices,
      material,
      echoes: [],
    };
  };

  const createPolygons = () => {
    const polygons = [];
    for (let i = 0; i < params.polygonCount; i++) {
      polygons.push(createPolygon());
    }
    return polygons;
  };
  polygons = createPolygons();

  function movePoint(point, velocity) {
    let newX = point.x + velocity.x * params.speed;
    let newY = point.y + velocity.y * params.speed;

    if (newX > boundingBox.max.x) {
      newX = boundingBox.max.x;
      velocity.x *= -1;
    } else if (newX < boundingBox.min.x) {
      newX = boundingBox.min.x;
      velocity.x *= -1;
    }

    if (newY > boundingBox.max.y) {
      newY = boundingBox.max.y;
      velocity.y *= -1;
    } else if (newY < boundingBox.min.y) {
      newY = boundingBox.min.y;
      velocity.y *= -1;
    }

    point.x = newX;
    point.y = newY;
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    polygons.forEach((polygon) => {
      // Move vertices
      polygon.vertices.forEach((point) => {
        movePoint(point.position, point.velocity);
      });

      // Create new edges
      const edges = [];
      for (let i = 0; i < polygon.vertices.length; i++) {
        const point1 = polygon.vertices[i].position;
        let point2;
        if (i === polygon.vertices.length - 1) {
          point2 = polygon.vertices[0].position;
        } else {
          point2 = polygon.vertices[i + 1].position;
        }

        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(point1.x, point1.y, 0),
          new THREE.Vector3(point2.x, point2.y, 0),
        ]);
        const edge = new THREE.Line(geometry, polygon.material);
        edges.push(edge);
        scene.add(edge);
      }

      // Delete old edges
      polygon.echoes.push(edges);
      if (polygon.echoes.length > params.echoCount) {
        const edgesToRemove = polygon.echoes.shift();
        edgesToRemove.forEach((edge) => {
          scene.remove(edge);
          edge.geometry.dispose();
        });
      }
    });

    stats.end();
    renderer.render(scene, camera);
  }

  animate();
};

export default {
  init,
};
