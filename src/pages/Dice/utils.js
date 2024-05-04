import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as CANNON from 'cannon-es';
import { findIndexOfMaxValue } from 'src/utils/misc';

export const getPolyhedronShape = (mesh) => {
  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', mesh.geometry.getAttribute('position'));

  geometry = BufferGeometryUtils.mergeVertices(geometry);

  const position = geometry.attributes.position.array;
  const index = geometry.index.array;

  const points = [];
  for (let i = 0; i < position.length; i += 3) {
    points.push(new CANNON.Vec3(position[i], position[i + 1], position[i + 2]));
  }
  const faces = [];
  for (let i = 0; i < index.length; i += 3) {
    faces.push([index[i], index[i + 1], index[i + 2]]);
  }

  return new CANNON.ConvexPolyhedron({ vertices: points, faces });
};

export const findDownFacingNormalIndex = (down, object) => {
  const dotProducts = [];
  object.normals.forEach((normal) => {
    dotProducts.push(normal.dot(down));
  });
  return findIndexOfMaxValue(dotProducts);
};

export const updateFaceNormals = (scene, object) => {
  const tri = new THREE.Triangle();
  const faceCenter = new THREE.Vector3();
  const normalVector = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();

  normalMatrix.getNormalMatrix(object.mesh.matrixWorld);
  const vertexCoords = object.mesh.geometry.attributes.position.array;

  for (let i = 0; i < vertexCoords.length / 9; i++) {
    tri.set(
      new THREE.Vector3(
        vertexCoords[i * 9],
        vertexCoords[i * 9 + 1],
        vertexCoords[i * 9 + 2],
      ),
      new THREE.Vector3(
        vertexCoords[i * 9 + 3],
        vertexCoords[i * 9 + 4],
        vertexCoords[i * 9 + 5],
      ),
      new THREE.Vector3(
        vertexCoords[i * 9 + 6],
        vertexCoords[i * 9 + 7],
        vertexCoords[i * 9 + 8],
      ),
    );
    tri.getNormal(normalVector);

    normalVector.applyMatrix3(normalMatrix).normalize();

    // Draw the normal at the center of the face
    faceCenter.addVectors(tri.a, tri.b);
    faceCenter.add(tri.c);
    faceCenter.divideScalar(3);

    // Convert center from local space to world space
    object.mesh.localToWorld(faceCenter);

    if (object.normalHelpers[i]) {
      object.normalHelpers[i].position.copy(faceCenter);
      object.normalHelpers[i].setDirection(normalVector);
    } else {
      const normalHelper = new THREE.ArrowHelper(
        normalVector,
        faceCenter,
        2,
        0x00ff00,
      );
      scene.add(normalHelper);
      object.normalHelpers[i] = normalHelper;
    }

    if (object.normals[i]) {
      object.normals[i].copy(normalVector);
    } else {
      object.normals[i] = normalVector.clone();
    }
  }
};
