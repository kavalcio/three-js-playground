import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

import { init } from './three';

export const Dither = () => {
  const rootRef = useRef(null);
  const [material, setMaterial] = useState();
  const [mesh, setMesh] = useState();

  useEffect(() => {
    const { material: ditherMaterial, mesh } = init({ root: rootRef.current });
    setMaterial(ditherMaterial);
    setMesh(mesh);
  }, []);

  const onImageSelect = (event) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;
    if (imageFile.type.indexOf('image/') !== 0) {
      alert('Please select an image file');
      return;
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      alert('Please select an image smaller than 10MB');
      return;
    }
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);
    image.onload = () => {
      material.uniforms.uMap.value = new THREE.TextureLoader().load(
        URL.createObjectURL(imageFile),
      );
      const imageAspectRatio = image.width / image.height;
      mesh.scale.set(imageAspectRatio, 1, 1);
    };
    image.onerror = () => {
      alert('Error loading image');
    };
  };

  return (
    <>
      <div ref={rootRef} />
      <input
        type="file"
        id="fileInput"
        style={{
          display: 'none',
        }}
        onChange={onImageSelect}
      />
    </>
  );
};
