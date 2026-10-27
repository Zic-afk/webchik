import * as THREE from 'three';

// All interaction distances are in world units, independent of GLB node scales.
export function createMarbleInteraction(scene, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mouse = new THREE.Vector2();
  const mouse3D = new THREE.Vector3();
  const cameraDirection = new THREE.Vector3();
  const lightTarget = new THREE.Vector3();
  const pointLight = new THREE.PointLight(0xffffff, 10, 15);
  pointLight.position.set(0, 0, 1.5);
  pointLight.intensity = 0;
  scene.add(pointLight);
  const uniforms = {
    uMouse: { value: new THREE.Vector3() },
    uTime: { value: 0 },
    uRadius: { value: 0.6 },
    uPushStrength: { value: 0.02 },
    uPulseStrength: { value: 0.01 },
    uPushDirection: { value: new THREE.Vector3(0, 0, -1) },
    uMaxDisplacement: { value: 0.004 },
    uActive: { value: 0 },
  };
  let active = false;
  const patchedMaterials = new Set();
  function move(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.set((event.clientX - rect.left) / rect.width * 2 - 1,
      -(event.clientY - rect.top) / rect.height * 2 + 1);
    active = true;
  }
  function leave() { active = false; }
  window.addEventListener('mousemove', move);
  document.documentElement.addEventListener('mouseleave', leave);
  window.addEventListener('blur', leave);

  function apply(mesh) {
    if (!mesh.geometry.attributes.normal) mesh.geometry.computeVertexNormals();
    // Keep the GLB material, including its colors, maps and surface settings.
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      if (patchedMaterials.has(material)) continue;
      patchedMaterials.add(material);
      const previousCompile = material.onBeforeCompile;
      const previousCacheKey = material.customProgramCacheKey();
      material.onBeforeCompile = (shader, webglRenderer) => {
        previousCompile.call(material, shader, webglRenderer);
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = shader.vertexShader.replace('#include <common>', `
          #include <common>
          uniform vec3 uMouse, uPushDirection;
          uniform float uTime, uRadius, uPushStrength, uPulseStrength, uActive;
          uniform float uMaxDisplacement;
          varying vec3 vOriginalViewPosition;
        `).replace('#include <begin_vertex>', `
          #include <begin_vertex>
          vec3 worldPositionBefore = (modelMatrix * vec4(position, 1.0)).xyz;
          float dist = distance(worldPositionBefore, uMouse);
          // Defined smoothstep ordering; taper the wave to zero at the brush edge.
          float falloff = 1.0 - smoothstep(0.0, uRadius, dist);
          float push = falloff * uPushStrength;
          float wave = sin(dist * 10.0 - uTime * 5.0)
            * exp(-dist * 2.0) * uPulseStrength * falloff;
          // A gentle gain plus a hard safety limit, in world units.
          float displacement = clamp((push + wave) * 0.15,
            -uMaxDisplacement, uMaxDisplacement) * uActive;
          // Coincident UV/hard-normal seam vertices must move together.
          // Convert one shared world-space direction back into each mesh's space.
          vec3 localPushDirection = inverse(mat3(modelMatrix)) * uPushDirection;
          transformed += localPushDirection * displacement;
          vOriginalViewPosition = -(modelViewMatrix * vec4(position, 1.0)).xyz;
        `);
        // Correct smooth lighting with the change in the geometric surface normal.
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
          #include <common>
          varying vec3 vOriginalViewPosition;
        `).replace('#include <normal_fragment_begin>', `
          #include <normal_fragment_begin>
          vec3 beforeNormal = normalize(cross(dFdx(vOriginalViewPosition), dFdy(vOriginalViewPosition)));
          vec3 afterNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
          normal = normalize(normal + (afterNormal - beforeNormal) * faceDirection);
        `);
        material.userData.shader = shader;
      };
      material.customProgramCacheKey = () => `${previousCacheKey}|cursor-deformation-v3`;
      material.needsUpdate = true;
    }
    // Shader displacement can extend beyond original bounds.
    mesh.frustumCulled = false;
  }
  return {
    apply,
    update(dt, time) {
      const smoothing = 1 - Math.pow(0.9, dt * 60);
      camera.getWorldDirection(cameraDirection);
      uniforms.uPushDirection.value.copy(cameraDirection);
      plane.setFromNormalAndCoplanarPoint(cameraDirection, scene.position);
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.ray.intersectPlane(plane, mouse3D);
      uniforms.uTime.value = time;
      uniforms.uActive.value = THREE.MathUtils.lerp(uniforms.uActive.value, active && hit ? 1 : 0, smoothing);
      if (hit) {
        uniforms.uMouse.value.lerp(mouse3D, smoothing);
        // Keep the lamp in front of the surface instead of inside the statue.
        lightTarget.copy(mouse3D).addScaledVector(cameraDirection, -1.5);
        pointLight.position.lerp(lightTarget, smoothing);
      }
      pointLight.intensity = 10 * uniforms.uActive.value;
    },
    dispose() {
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
      window.removeEventListener('blur', leave);
      pointLight.removeFromParent();
      pointLight.dispose();
      patchedMaterials.clear();
    },
  };
}
