const vertexShaderTxt =
`
    attribute vec2 vertPosition;
    void main(){
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`
    ;

const fragmentShaderTxt =
`   precision mediump float;
    uniform vec3 fragColor;
    void main(){
        gl_FragColor = vec4(fragColor, 1.);
    }
`
    ;


const Triangle = function(){
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("no webgl");
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.useProgram(program);
    

    let triangleVert = [
        0.0, 0.5, 
        -0.5, -0.5, 
        0.5, -0.5, 
    ];


    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVert), gl.STATIC_DRAW);

    const posAttrLocation = gl.getAttribLocation(program, `vertPosition`);
    gl.vertexAttribPointer(posAttrLocation, 2, gl.FLOAT, gl.FALSE, 0, 0,);

    const colorUniformLocation = gl.getUniformLocation(program, "fragColor");

    var color = [1.0, 1.0, 1.0]; 
    gl.uniform3fv(colorUniformLocation, color);

    const button = document.querySelector("#color-switcher");
    button.addEventListener("click", switchColor, false);

    function switchColor() {
        const newColor = [Math.random(), Math.random(), Math.random()];
        color = newColor;
        gl.uniform3fv(colorUniformLocation, color);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorUniformLocation);
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  



};

window.addEventListener("load", Triangle, false);
  