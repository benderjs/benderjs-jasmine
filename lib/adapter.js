/**
 * Copyright (c) 2014, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

( function( bender ) {
	window.jasmine = jasmineRequire.core( jasmineRequire );

	var env = jasmine.getEnv();

	// expose jasmine API
	window.describe = function( desc, spec ) {
		return env.describe( desc, spec );
	};

	window.xdescribe = function( desc, spec ) {
		return env.xdescribe( desc, spec );
	};

	window.it = function( desc, func ) {
		return env.it( desc, func );
	};

	window.xit = function( desc, func ) {
		return env.xit( desc, func );
	};

	window.beforeEach = function( func ) {
		return env.beforeEach( func );
	};

	window.afterEach = function( func ) {
		return env.afterEach( func );
	};

	window.expect = function( actual ) {
		return env.expect( actual );
	};

	window.pending = function() {
		return env.pending();
	};

	window.spyOn = function( obj, methodName ) {
		return env.spyOn( obj, methodName );
	};

	jasmine.addCustomEqualityTester = function( tester ) {
		env.addCustomEqualityTester( tester );
	};

	jasmine.addMatchers = function( matchers ) {
		return env.addMatchers( matchers );
	};

	jasmine.clock = function() {
		return env.clock;
	};

	function Suite( name, parent ) {
		this.name = name;
		this.parent = parent;
	}

	// custom reporter that will pass the results to bender
	function BenderReporter() {
		var timer = new jasmine.Timer(),
			current = new Suite(),
			passed = 0,
			failed = 0,
			errors = 0,
			ignored = 0,
			total = 0;

		function buildError( result ) {
			var pattern = /\n.*jasmine.js.*/gi,
				error = [],
				exp,
				i;

			for ( i = 0; i < result.failedExpectations.length; i++ ) {
				errors++;

				exp = result.failedExpectations[ i ];

				if ( exp.stack ) {
					if ( exp.stack.indexOf( exp.message ) === -1 ) {
						error.push( exp.message );
					}

					error.push(
						exp.stack
						.replace( pattern, '' )
					);
				} else {
					error.push( exp.message );
				}
			}

			return error.join( '\n' );
		}

		this.jasmineStarted = function() {
			timer.start();
		};

		this.jasmineDone = function() {
			bender.next( {
				duration: timer.elapsed(),
				passed: passed,
				failed: failed,
				errors: errors,
				ignored: ignored,
				total: total,
				coverage: window.__coverage__
			} );
		};

		this.suiteStarted = function( suite ) {
			current = new Suite( suite.fullName, current );
		};

		this.suiteDone = function() {
			current = current.parent;
		};

		this.specStarted = function( result ) {
			total++;
			result.startTime = +new Date();
		};

		this.specDone = function( result ) {
			result.module = current.name || '';
			result.name = result.description;
			result.fullName = result.fullName;
			result.success = true;
			result.duration = +new Date() - result.startTime;

			if ( result.status === 'passed' ) {
				passed++;
			} else if ( result.status === 'disabled' || result.status === 'pending' ) {
				result.ignored = true;
				ignored++;
			} else {
				result.success = false;
				result.error = buildError( result );
				result.errors = errors;
				failed++;
			}

			bender.result( result );
		};
	}

	env.catchExceptions( false );

	// add reporters
	env.addReporter( new jasmine.JsApiReporter( {
		timer: new jasmine.Timer()
	} ) );

	env.addReporter( new BenderReporter() );

	function isRegression( spec ) {
		var condition;

		return bender.regressions &&
			( condition = bender.regressions[ bender.testData.id + '#' + spec.getFullName() ] ) &&
			eval( condition );
	}

	function isSingle( spec ) {
		return spec.getFullName() === decodeURIComponent( window.location.hash.substr( 1 ) );
	}

	// check for regression or single test execution
	env.specFilter = function( spec ) {
		return !isRegression( spec ) && ( !window.location.hash || window.location.hash === '#child' || isSingle( spec ) );
	};

	bender.start = function start() {
		env.execute();
	};

	bender.stopRunner = function() {
		// TODO
	};

} )( bender );
