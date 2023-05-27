const vertexShaderTxt =
`
    precision mediump float;
    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main(){
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }
`
    ;

const fragmentShaderTxt =
    `   precision mediump float;
        varying vec3 fragColor;
        void main(){
            gl_FragColor = vec4(fragColor, 1.);
        }
`
    ;
const mat4 = glMatrix.mat4;

function Cube() {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    if (!gl){
        alert("no webgl");
        return ;
    }
    gl.clearColor(0.0, 0.96, 0.83, 0.54);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);
    var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    const sideNat = 1.0;
    const topColor = [1.0, 0.0, 0.0];       // Red color for the top face
    const leftColor = [0.0, 1.0, 0.0];      // Green color for the left face
    const rightColor = [0.0, 0.0, 1.0];     // Blue color for the right face
    const frontColor = [1.0, 1.0, 0.0];     // Yellow color for the front face
    const backColor = [0.0, 1.0, 1.0];      // Cyan color for the back face
    const bottomColor = [1.0, 0.0, 1.0];   

    function cubeGen(sideNat){
        const side = sideNat/2;
        return [
            //top
            -side, side, -side, ...topColor,
            -side, side, side, ...topColor,
            side, side, side, ...topColor,
            side, side, -side, ...topColor,
            //left
            -side, -side, -side, ...leftColor,
            -side, -side, side, ...leftColor,
            -side, side, side, ...leftColor,
            -side, side, -side, ...leftColor,
            //right
            side, -side, -side, ...rightColor,
            side, side, -side, ...rightColor,
            side, side, side, ...rightColor,
            side, -side, side, ...rightColor,
            //front
            -side, -side, side, ...frontColor,
            side, -side, side, ...frontColor,
            side, side, side, ...frontColor,
            -side, side, side, ...frontColor,
            //back
            -side, -side, -side, ...backColor,
            -side, side, -side, ...backColor,
            side, side, -side, ...backColor,
            side, -side, -side, ...backColor,
            //bottom
            -side, -side, -side, ...bottomColor,
            side, -side, -side, ...bottomColor,
            side, -side, side, ...bottomColor,
            -side, -side, side, ...bottomColor,


        ];
    };

    const cubeVertices = cubeGen(sideNat, topColor, leftColor, rightColor, frontColor, backColor, bottomColor);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);


    const posAttrLocation = gl.getAttribLocation(program, `vertPosition`);
    gl.vertexAttribPointer(posAttrLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0,);

    const boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    const colorAttrLocation = gl.getAttribLocation(program, `vertColor`);
    gl.vertexAttribPointer(colorAttrLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0*Float32Array.BYTES_PER_ELEMENT,);



    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);
    gl.useProgram(program);

    const matWorldUniformLocation = gl.getUniformLocation(program, "mWorld"); 
    const matViewUniformLocation = gl.getUniformLocation(program, "mView");
    const matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    let worldMatrix = mat4.create();
    let worldMatrix2 = mat4.create();
    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
    let projMatrix = mat4.create();
    mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.clientHeight, 0.1, 1000.0);
    
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    let identityMatrix = mat4.create();
    let rotationMatrix = new Float32Array(16);
    let translationMatrix = new Float32Array(16);
    let angle = 0;
    const loop = function(){
        angle = performance.now() / 1000 / 8 * 2 * Math.PI;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.fromRotation(rotationMatrix, angle, [2, 1, 0]);
        mat4.fromTranslation(translationMatrix, [-2, 1, 0]);
        mat4.mul(worldMatrix, translationMatrix, rotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.False, worldMatrix);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);



        rotationMatrix = new Float32Array(16);
        translationMatrix = new Float32Array(16);
        mat4.fromRotation(rotationMatrix, angle/2, [2, 1, 0]);
        mat4.fromTranslation(translationMatrix, [2, -1, 0]);
        mat4.mul(worldMatrix2, translationMatrix, rotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.False, worldMatrix2);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};