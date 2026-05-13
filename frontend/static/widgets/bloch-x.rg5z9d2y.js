import*as q from"https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.min.js";import{OrbitControls as j}from"https://cdn.jsdelivr.net/npm/three@0.184.0/examples/jsm/controls/OrbitControls.js";var W=new q.Scene,K=new q.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000),F=new q.WebGLRenderer({antialias:!0,alpha:!0});F.setPixelRatio(Math.min(window.devicePixelRatio||1,2));F.setSize(window.innerWidth-20,window.innerHeight-20);document.body.appendChild(F.domElement);function $(){let k=window.innerWidth-20,B=window.innerHeight-20;K.aspect=k/B,K.updateProjectionMatrix(),F.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),F.setSize(k,B)}window.addEventListener("resize",$);var C=new q.SphereGeometry(1,32,32),G=new q.BufferGeometry().setFromPoints([new q.Vector3(0,0,0),new q.Vector3(0,1,0)]),O=new q.LineBasicMaterial({color:16711680}),J=new q.Line(G,O);W.add(J);K.position.z=3;function Z(){requestAnimationFrame(Z);let k=performance.now()*0.001;P.uTime.value=k,P.uEntropy.value=A.entropy,U(),F.render(W,K)}var A={rotation:0,entropy:0,targetEntropy:0.2,pointerPos:new q.Vector3(0,1,0)};window.addEventListener("mousemove",(k)=>{let B=k.clientX/window.innerWidth*2-1,I=k.clientY/window.innerHeight*2-1;A.rotation=B*Math.PI,A.targetEntropy=1-(1+I)/2});function U(){A.entropy+=(A.targetEntropy-A.entropy)*0.1;let k=1-A.entropy,B=Math.cos(A.rotation)*k,I=Math.sin(A.rotation)*k,L=0;V(A.entropy,B,I,L)}function V(k,B,I,L){let D=1-k;Q.scale.set(D,D,D),Q.material.wireframeLineWidth=1+k*5,J.lookAt(new q.Vector3(B,L,-I)),J.scale.set(D,D,D),J.material.opacity=D;let N=Math.floor((1-k)*20);document.body.style.backgroundColor=`rgb(${N}, ${N}, ${N+10})`}var X=`
    varying vec2 vUv;
    varying float vNoise;
    uniform float uTime;
    uniform float uEntropy;

    // 经典的 3D 噪声函数
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy * 2.0;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
        vUv = uv;
        // 噪声随时间和熵值变化
        vNoise = snoise(normal * 2.0 + uTime * 0.5) * uEntropy;
        // 根据噪声位移顶点：熵越大，表面越抖动
        vec3 newPosition = position + normal * vNoise * 0.3;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`,Y=`
    varying vec2 vUv;
    varying float vNoise;
    uniform float uEntropy;

    void main() {
        // 基础颜色从 青色 (纯态) 变为 红色 (混合态)
        vec3 pureColor = vec3(0.0, 1.0, 0.8);
        vec3 mixedColor = vec3(1.0, 0.2, 0.2);
        vec3 color = mix(pureColor, mixedColor, uEntropy);

        // 增加一点噪声带来的亮度变化
        color += vNoise * 0.1;

        // 熵越大，透明度越低，边缘越模糊
        float alpha = 0.8 - uEntropy * 0.5;
        gl_FragColor = vec4(color, alpha);
    }
`,P={uTime:{value:0},uEntropy:{value:0}},_=new q.ShaderMaterial({vertexShader:X,fragmentShader:Y,uniforms:P,transparent:!0,wireframe:!0}),Q=new q.Mesh(C,_);W.add(Q);Z();
