import React, { useRef, useEffect, useCallback } from 'react';

declare var THREE: any; // Declare THREE as a global variable since it's loaded via CDN

const ThreeDustParticles: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const animate = useCallback((
    renderer: any, // Use 'any' for THREE.WebGLRenderer for simplicity given global THREE
    scene: any,    // Use 'any' for THREE.Scene
    camera: any,   // Use 'any' for THREE.PerspectiveCamera
    particles: any // Use 'any' for THREE.Points
  ) => {
    requestAnimationFrame(() => animate(renderer, scene, camera, particles));

    const positions = particles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      // Simulate subtle, random movement
      positions[i] += (Math.random() - 0.5) * 0.005;
      positions[i + 1] += (Math.random() - 0.5) * 0.005;
      positions[i + 2] += (Math.random() - 0.5) * 0.005;

      // Wrap particles if they go too far
      if (Math.abs(positions[i]) > 100) positions[i] *= -1;
      if (Math.abs(positions[i + 1]) > 100) positions[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 100) positions[i + 2] *= -1;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Camera subtle movement based on mouse
    camera.position.x += (mouseX.current * 0.01 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY.current * 0.01 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    let width = currentMount.clientWidth;
    let height = currentMount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.002);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    currentMount.appendChild(renderer.domElement);

    // Particles
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color = new THREE.Color();

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() * 2 - 1) * 100; // x
      positions[i + 1] = (Math.random() * 2 - 1) * 100; // y
      positions[i + 2] = (Math.random() * 2 - 1) * 100; // z

      // Dust color variations
      color.setHSL(0.1, Math.random() * 0.5 + 0.5, Math.random() * 0.2 + 0.5); // Warm, desaturated tones
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse move handler
    const onMouseMove = (event: MouseEvent) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, false);

    // Handle window resize
    const onWindowResize = () => {
      width = currentMount.clientWidth;
      height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate(renderer, scene, camera, particles);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [animate]);

  return <div ref={mountRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />;
};

export default ThreeDustParticles;
