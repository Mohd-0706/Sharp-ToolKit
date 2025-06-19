/**
 * Enhanced 3D Background for Hero Section
 */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('hero-shapes')) {
        initHeroShapes();
    }
});

function initHeroShapes() {
    try {
        const container = document.getElementById('hero-shapes');
        if (!container || !window.THREE) return;

        // Scene setup with subtle fog
        const scene = new THREE.Scene();
        scene.background = null;
        scene.fog = new THREE.FogExp2(0xe0e7ff, 0.0015);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 23;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        const directionalLight1 = new THREE.DirectionalLight(0x4f46e5, 0.6);
        directionalLight1.position.set(1, 1, 1);
        const directionalLight2 = new THREE.DirectionalLight(0x10b981, 0.6);
        directionalLight2.position.set(-1, -1, -1);
        scene.add(ambientLight, directionalLight1, directionalLight2);

        // Group for shapes
        const shapesGroup = new THREE.Group();
        scene.add(shapesGroup);

        const shapeTypes = [
            { type: 'sphere', size: 1.2 },
            { type: 'torus', size: 1.5 },
            { type: 'octahedron', size: 1.3 },
            { type: 'torusKnot', size: 1.4 },
            { type: 'dodecahedron', size: 1.2 },
            { type: 'icosahedron', size: 1.3 }
        ];

        const colors = [
            { main: 0x4f46e5, glow: 0x818cf8 },
            { main: 0x10b981, glow: 0x34d399 },
            { main: 0x8b5cf6, glow: 0xa78bfa },
            { main: 0xec4899, glow: 0xf472b6 },
            { main: 0xf59e0b, glow: 0xfbbf24 },
            { main: 0x3b82f6, glow: 0x60a5fa }
        ];

        const shapes = [];
        const shapeCount = 25;

        for (let i = 0; i < shapeCount; i++) {
            const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = shapeType.size * (0.8 + Math.random() * 0.4);

            let geometry;
            switch (shapeType.type) {
                case 'sphere': geometry = new THREE.SphereGeometry(size, 32, 32); break;
                case 'torus': geometry = new THREE.TorusGeometry(size * 0.6, size * 0.3, 16, 32); break;
                case 'octahedron': geometry = new THREE.OctahedronGeometry(size, 1); break;
                case 'torusKnot': geometry = new THREE.TorusKnotGeometry(size * 0.7, size * 0.2, 100, 16); break;
                case 'dodecahedron': geometry = new THREE.DodecahedronGeometry(size, 0); break;
                case 'icosahedron': geometry = new THREE.IcosahedronGeometry(size, 1); break;
            }

            const mainMaterial = new THREE.MeshPhongMaterial({
                color: color.main,
                transparent: true,
                opacity: 0.9,
                shininess: 100,
                specular: 0x111111,
                flatShading: false
            });

            const glowMaterial = new THREE.MeshBasicMaterial({
                color: color.glow,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });

            const mainShape = new THREE.Mesh(geometry, mainMaterial);
            const glowShape = new THREE.Mesh(geometry, glowMaterial);
            glowShape.scale.set(1.2, 1.2, 1.2);

            const shapeGroup = new THREE.Group();
            shapeGroup.add(mainShape, glowShape);

            // Wider spatial distribution
            shapeGroup.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 60 - 20
            );

            shapeGroup.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            shapeGroup.userData = {
                speed: 0.05 + Math.random() * 0.1,
                rotationSpeed: new THREE.Vector3(
                    Math.random() * 0.005,
                    Math.random() * 0.005,
                    Math.random() * 0.005
                ),
                amplitude: 0.5 + Math.random(),
                initialPosition: shapeGroup.position.clone(),
                pulseSpeed: 0.5 + Math.random() * 0.5,
                pulseSize: 0.05 + Math.random() * 0.1
            };

            shapes.push(shapeGroup);
            shapesGroup.add(shapeGroup);
        }

        // Particle setup
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 1500;
        const posArray = new Float32Array(particleCount * 3);
        const sizeArray = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 150;
            if (i % 3 === 0) {
                sizeArray[i / 3] = Math.random() * 0.1 + 0.05;
            }
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x4f46e5,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Mouse tracking
        const mouse = new THREE.Vector2();
        const targetMouse = new THREE.Vector2();
        const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

        const handleMouseMove = (event) => {
            mouse.x = (event.clientX - windowHalf.x) * 0.0003;
            mouse.y = (event.clientY - windowHalf.y) * 0.0003;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            targetMouse.x += (mouse.x - targetMouse.x) * 0.02;
            targetMouse.y += (mouse.y - targetMouse.y) * 0.02;

            shapes.forEach(shapeGroup => {
                shapeGroup.rotation.x += shapeGroup.userData.rotationSpeed.x;
                shapeGroup.rotation.y += shapeGroup.userData.rotationSpeed.y;
                shapeGroup.rotation.z += shapeGroup.userData.rotationSpeed.z;

                shapeGroup.position.y = shapeGroup.userData.initialPosition.y +
                    Math.sin(time * shapeGroup.userData.speed) * shapeGroup.userData.amplitude;

                shapeGroup.position.x = shapeGroup.userData.initialPosition.x +
                    Math.cos(time * shapeGroup.userData.speed * 0.7) * shapeGroup.userData.amplitude;

                const pulse = Math.sin(time * shapeGroup.userData.pulseSpeed) * shapeGroup.userData.pulseSize;
                shapeGroup.children[1].scale.set(1.2 + pulse, 1.2 + pulse, 1.2 + pulse);

                shapeGroup.position.z += (targetMouse.y * 8 - shapeGroup.position.z) * 0.01;
            });

            particlesMesh.rotation.y = time * 0.02;

            camera.position.x += (targetMouse.x * 15 - camera.position.x) * 0.03;
            camera.position.y += (-targetMouse.y * 10 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
        };

        window.addEventListener('resize', handleResize);
        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
        };
    } catch (error) {
        console.error('Three.js background error:', error);
    }
}