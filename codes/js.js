var canvas; // canvas
var gl;	// gl
var vertexShaderObject; // 顶点着色器对象
var fragmentShaderObject;	// 片元着色器对象
var programObject;	// gl程序对象
window.onload = function() {
	init();
	fun1();
}

function getShaderSource(id) {
	var shaderScript = document.getElementById(id);
	if (shaderScript == null) return "";

	var sourceCode = "";
	var child = shaderScript.firstChild;

	while(child) {
		if (child.nodeType == child.TEXT_NODE) sourceCode += child.textContent;
		child = child.nextSibling;
	}

	return sourceCode;
}

function init(){
	canvas = document.getElementById('canvas');
	gl = canvas.getContext('webgl');
	gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// 创建两个空的shader工程,返回的值是句柄
	vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
	fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);

	// 为shader工程添加着色器代码
	gl.shaderSource(vertexShaderObject, getShaderSource('shader-vs'));
	gl.shaderSource(fragmentShaderObject, getShaderSource('shader-fs'));
	
	// 把这两个工程从字符串编译为汇编
	gl.compileShader(vertexShaderObject);
	gl.compileShader(fragmentShaderObject);

	// 得到着色器对象的状态参数，判断是否编译成功
	if(!gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS)) {
		console.log('顶点着色器编译失败');
		return;
	}
	if(!gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS)) {
		console.log('片元着色器编译失败');
		return;
	}

	// 创建一个gl程序 空壳
	programObject = gl.createProgram();

	// 把之前创建的编译好的着色器对象导入gl程序，成为一个可执行的程序
	gl.attachShader(programObject, vertexShaderObject);
	gl.attachShader(programObject, fragmentShaderObject);

	// 将这段gl程序连接到gl系统
	gl.linkProgram(programObject);

	if (!gl.getProgramParameter(programObject, gl.LINK_STATUS))
	{
		console.log('gl程序连接失败');
		return;
	}

	// 指定gl系统所使用的gl程序。
	// 可能gl程序有很多个，可以来回切换，所以需要指定
	// 就像数据库一样，进入数据库，还要指定use哪一个库
	gl.useProgram(programObject);
}

/** 绘制三角形 **/
function fun1() {
	var v3Position = gl.getAttribLocation(programObject, 'v3Position');

	var data = [
		0.0, 1.0, 0.0,
		-1.0, -1.0, 0.0,
		1.0, -1.0, 0.0
	];
	// 创建一个缓冲区
	var buffer = gl.createBuffer();
	// 设定缓冲区类型：ARRAY_BUFFER
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	// 向缓冲区赋值
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);	

	// 绘制方式
	gl.vertexAttribPointer(v3Position, 3, gl.FLOAT, false, 0, 0);
	// 启用这个变量 
	gl.enableVertexAttribArray(v3Position);

	
	// 绘制
	gl.drawArrays(gl.TRIANGLES,0,3);
}