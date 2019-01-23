// this is global
env = (function(e){
	var env = function(name){ return name === e;}
	env.toString = function() { return e };
	env[e] = true;
	return env;
})(process.env.NODE_ENV || "development")
