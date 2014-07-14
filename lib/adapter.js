( function( bender ) {
	window.jasmine = jasmineRequire.core( jasmineRequire );

	var env = jasmine.getEnv();

	function nop() {}

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
			ignored = 0,
			total = 0;

		function buildError( result ) {
			var pattern = /^Error:\s|\n.+jasmine.js.+\)/gi,
				error = [],
				i;

			for ( i = 0; i < result.failedExpectations.length; i++ ) {
				error.push(
					result.failedExpectations[ i ].stack
					.replace( pattern, '' )
				);
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
				ignored: ignored,
				total: total
			} );
		};

		this.suiteStarted = function( suite ) {
			current = new Suite( suite.fullName, current );
		};

		this.suiteDone = function() {
			current = current.parent;
		};

		this.specStarted = function() {
			total++;
		};

		this.specDone = function( result ) {
			result.module = current.name || '';
			result.name = result.description;
			result.success = true;

			if ( result.status === 'passed' ) {
				passed++;
			} else if ( result.status === 'disabled' || result.status === 'pending' ) {
				result.ignored = true;
				ignored++;
			} else {
				result.success = false;
				result.error = buildError( result );
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

	bender.start = function start() {
		// TODO handle regressions, handle single runs
		env.execute();
	};

	bender.stopRunner = function() {
		// TODO
	};

} )( bender );