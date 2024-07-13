vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_BATCHING

  mvPosition = batchingMatrix * mvPosition;

#endif

#ifdef USE_INSTANCING

  mvPosition = instanceMatrix * mvPosition;

#endif

mvPosition = modelMatrix * mvPosition;

mvPosition = vec4(
  round(mvPosition.x * uSnappingResolution) / uSnappingResolution,
  round(mvPosition.y * uSnappingResolution) / uSnappingResolution,
  round(mvPosition.z * uSnappingResolution) / uSnappingResolution,
  1.0);

mvPosition = viewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;
