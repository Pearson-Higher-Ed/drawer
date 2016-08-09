/*global describe, it, before, after*/
'use strict';

var expect = require('expect.js');

var Drawer = require('./../src/js/Drawer');

function isExpanded(element, trigger) {
    return element.classList.contains('o-drawer-open') &&
        trigger.getAttribute('aria-expanded') === 'true';
}

describe('Drawer', function() {

	it('should initialise', function() {
		expect(new Drawer(document.body)).to.not.be(undefined);
	});

	it('should throw when called without \'new\'', function () {
		expect(function () { Drawer(); }).to.throwException(function (e) { // jshint ignore:line
			expect(e).to.be.a(TypeError);
			expect(e.message).to.match(/Constructor Drawer requires \'new\'/);
		});
	});

	it('should throw when no arguments are provided', function () {
		expect(function () { new Drawer(); }).to.throwException(function (e) {
			expect(e).to.be.a(TypeError);
			expect(e.message).to.match(/missing required argument/);
		});
	});

	it('should accept a string argument', function () {
		new Drawer('body');
	});

	describe('Drawer.init()', function(){
		before(function () {
			var element1 = document.createElement('div');
			element1.setAttribute('data-o-component', 'o-drawer');
			document.body.appendChild(element1);

			var element2 = document.createElement('div');
			element2.setAttribute('data-o-component', 'o-drawer');
			document.body.appendChild(element2);
		});

		it('should init all drawer elements', function () {
			var drawers = Drawer.init();
			expect(drawers.length).to.be(2);
		});

		it('should work when element is a selector', function () {
			var drawers = Drawer.init('body');
			expect(drawers.length).to.be(2);
		});
	});

	describe('Drawer.destroy()', function () {

		var bodyDelegate;

		before(function () {
			bodyDelegate = Drawer.bodyDelegate;
		});

		after(function () {
			Drawer.bodyDelegate = bodyDelegate;
		});

		it('should destroy', function () {
			var destroyed = false;
			Drawer.bodyDelegate = {
				destroy: function () { destroyed = true; }
			};

			Drawer.destroy();

			expect(destroyed).to.be(true);
		});

	});


        describe('open()', function(done) {
            it('should show the element and set the correct states', function () {
                var element = document.createElement('div')
                    ,trigger = document.createElement('button');

                element.id="foo";
                trigger.setAttribute('aria-expanded', 'false');
                trigger.setAttribute('data-open','o-drawer');
                trigger.setAttribute('data-target','#foo');

                document.body.appendChild(element);
                document.body.appendChild(trigger);

                var drawer = new Drawer(element);

                expect(isExpanded(element, trigger)).to.be(false);

                trigger.click();
                setTimeout(function(){
                    expect(isExpanded(element,trigger)).to.be(true);
                    done();
                }, 100);
            });

            it('should emit oDrawer.open', function (done) {
                var element = document.createElement('div');
                document.body.appendChild(element);

                var drawer = new Drawer(element);

                element.addEventListener('oDrawer.open', function (e) {
                    expect(e.target).to.be(element);
                    done();
                });

                drawer.open();
            });
        });

	describe('close()', function() {
		it('should hide the element', function () {
			var element = document.createElement('div');
			document.body.appendChild(element);

			var drawer = new Drawer(element);
			drawer.open();
			drawer.close();

			expect(isExpanded(element)).to.be(false);
		});

		it('should emit oDrawer.close', function (done) {
			var element = document.createElement('div');
			document.body.appendChild(element);

			var drawer = new Drawer(element);

			element.addEventListener('oDrawer.close', function (e) {
				expect(e.target).to.be(element);
				done();
			});

			drawer.close();
		});

		it('should emit o.Drawer.RightDrawer', function(done) {
			var element = document.createElement('div');
			element.classList.add('o-drawer-right');
			document.body.appendChild(element);

			var drawer = new Drawer(element);

			element.addEventListener('o.Drawer.RightDrawer', function(e) {
				expect(drawer.currentTarget).to.be(true);
				done();
			});

			drawer.open();
			expect(drawer.currentTarget).to.be(false);
		});

		it('should emit o.Drawer.LeftDrawer', function(done) {
			var element = document.createElement('div')
			element.classList.add('o-drawer-left');
			document.body.appendChild(element);

			var drawer = new Drawer(element);

			element.addEventListener('o.Drawer.LeftDrawer', function(e) {
				expect(drawer.currentTarget).to.be(true);
				done();
			});

			drawer.open();
			expect(drawer.currentTarget).to.be(false);

		});
	});

	describe('toggle()', function(done) {
		it('should toggle the element open and close', function () {
			var element = document.createElement('div');
			document.body.appendChild(element);

			var drawer = new Drawer(element);
			drawer.toggle();
			setTimeout(function(){
				expect(isExpanded(element)).to.be(true);
				drawer.toggle();
				expect(isExpanded(element)).to.be(false);
				done();
			}, 100);

		});
	});
});
