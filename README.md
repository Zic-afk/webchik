# Interactive marble statue

Run: `npm.cmd run dev`. Build: `npm.cmd run build`.

The model loads through GLTFLoader with MeshoptDecoder. Original GLB materials, colors, textures and surface settings are preserved. The cursor shader is attached to each original material through onBeforeCompile; shared materials are patched only once. The local studio_kontrast_04_1k.exr supplies PMREM environment lighting.

src/marbleInteraction.js contains the cursor interaction. Raycaster intersects a camera-facing plane through the statue centre. A white PointLight (intensity 10, distance 15) follows with smoothing equivalent to lerp 0.1 at 60 fps. The light stays 1.5 world units in front of the plane. Effects fade out on mouse leave or window blur.

Shader uniforms: uMouse (world position), uTime, uRadius (0.6), uPushStrength (0.02), uPulseStrength (0.01), uActive, uPushDirection, uMaxDisplacement (0.004). A final gain of 0.15 and clamp make the actual deformation gentler than the original version. Displacement follows one shared world-space camera direction rather than individual vertex normals, keeping coincident seam vertices together. Collision prevention is not provided. The wave is tapered at the brush radius. The shader compensates for mesh scaling, so the effect follows the cursor during scroll rotation and swaying. Fragment derivatives adjust smooth surface normals to the deformation. Compiled shaders are stored in material.userData.shader.

Ambient swaying, camera/light movement and GSAP scroll rotation remain enabled. The interaction plane is an approximation, not a raycast against the visible surface; there is no occlusion or collision simulation.
