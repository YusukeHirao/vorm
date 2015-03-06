(function () {
	"use strict";

	var global = this;

	var isBrowser = 'document' in global;
	var isWebWorkers = 'WorkerLocation' in global;
	var isNode = 'process' in global;
