/*global describe, it, before, after*/
'use strict';

var expect = require('expect.js');

var Drawer = require('./../src/js/Drawer');

function isExpanded(element, trigger) {
    return element.classList.contains('o-drawer-open') &&
        trigger.getAttribute('aria-expanded') === 'true';
}

function isFocussed(close_button) {
    return document.activeElement === close_button;
}

function lastFocusableRemains(drawer) {
    var last = drawer.last_focusable
        ,focusables = Array.prototype.slice.call(drawer.target.querySelectorAll(
          '[tabindex="0"], a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'));

    return last === focusables[focusables.length-1];
}

function addFocusables(div) {
    var fraggle = document.createDocumentFragment()
        ,button = document.createElement('button')
        ,a = document.createElement('a')
        ,h3 = document.createElement('h3');

    button.textContent = 'button text';

    a.href='#f';
    a.textContent = 'text';

    h3.setAttribute('tabindex', '0');
    h3.textContent = 'heading';

    fraggle.appendChild(button);
    fraggle.appendChild(a);
    fraggle.appendChild(h3);
    div.appendChild(fraggle);
}

describe('Drawer', function() {

    it('should initialise', function() {
        expect(new Drawer(document.body)).to.not.be(undefined);
    });

    it('should throw when called without \'new\'', function() {
        expect(function() { Drawer(); }).to.throwException(function(e) { // jshint ignore:line
            expect(e).to.be.a(TypeError);
            expect(e.message).to.match(/Constructor Drawer requires \'new\'/);
        });
    });

    it('should throw when no arguments are provided', function() {
        expect(function() { new Drawer(); }).to.throwException(function(e) {
            expect(e).to.be.a(TypeError);
            expect(e.message).to.match(/missing required argument/);
        });
    });

    it('should accept a string argument', function() {
        new Drawer('body');
    });

    describe('Drawer.init()', function(){
        before(function() {
            var element1 = document.createElement('div');
            element1.setAttribute('data-o-component', 'o-drawer');
            document.body.appendChild(element1);

            var element2 = document.createElement('div');
            element2.setAttribute('data-o-component', 'o-drawer');
            document.body.appendChild(element2);
        });

        it('should init all drawer elements', function() {
            var drawers = Drawer.init();
            expect(drawers.length).to.be(2);
        });

        it('should work when element is a selector', function() {
            var drawers = Drawer.init('body');
            expect(drawers.length).to.be(2);
        });
    });

    describe('Drawer.destroy()', function() {
        var bodyDelegate;

        before(function() {
            bodyDelegate = Drawer.bodyDelegate;
        });

        after(function() {
            Drawer.bodyDelegate = bodyDelegate;
        });

        it('should destroy', function() {
            var destroyed = false;
            Drawer.bodyDelegate = {
                    destroy: function() { destroyed = true; }
            };

            Drawer.destroy();

            expect(destroyed).to.be(true);
        });
    });


    describe('open()', function(done) {
        before(function () {
            var element = document.createElement('div')
                ,opener = document.createElement('button')
                ,close = document.createElement('button')
                ,make_more_focusables_button = document.createElement('button')
                ,button_parent_div = document.createElement('div')
                ,an_existing_focusable = document.createElement('a');

            element.id = 'foo';

            opener.id = 'opener';
            opener.setAttribute('aria-expanded', 'false');
            opener.setAttribute('data-open', 'o-drawer');
            opener.setAttribute('data-target', '#foo');

            close.setAttribute('data-close', 'o-drawer');
            make_more_focusables_button.id = 'newbutton';
            an_existing_focusable.href = '#b';

            button_parent_div.appendChild(make_more_focusables_button);

            make_more_focusables_button.addEventListener('click', function() {
                addFocusables(button_parent_div);
            });

            document.body.appendChild(element);
            document.body.appendChild(opener);
            element.appendChild(close);
            element.appendChild(button_parent_div);
            element.appendChild(an_existing_focusable);
        });

        it('should show the element and set the correct states', function () {
            var element = document.getElementById('foo')
                ,opener = document.getElementById('opener')
                ,drawer = new Drawer(element);

            opener.click();
            setTimeout(function() {
                expect(isExpanded(element,opener)).to.be(true);
                expect(isFocussed(close)).to.be(true);
                done();
            }, 100);
        });

        //this test is only if we don't end up needing our own special lastFocusable.
        it('should keep track of the last focusable', function() {
            var element = document.getElementById('foo')
                ,opener = document.getElementById('opener')
                ,button = document.getElementById('newbutton')
                ,drawer = new Drawer(element);

            expect(lastFocusableRemains(drawer)).to.be(true);

            opener.click();
            setTimeout(function(drawer, button) {
                button.click();
                expect(lastFocusableRemains(drawer)).to.be(true);
                expect(drawer.lastFocusable.href).to.equal('#b');
                done();
            }.bind(this, drawer, button), 100);
        });

        it('should emit oDrawer.open', function(done) {
            var element = document.getElementById('foo')
                ,opener = document.getElementById('opener')
                ,drawer = new Drawer(element);

            element.addEventListener('oDrawer.open', function(e) {
                expect(e.target).to.be(element);
                done();
            });

            opener.click();
        });
    });

    describe('close()', function() {
        before(function() {
            var element = document.createElement('div')
                ,closer = document.createElement('button')
                ,close = document.createElement('button');

            element.id = 'foo';
            element.classList.add('o-drawer-open');

            closer.id = 'closer';
            closer.setAttribute('aria-expanded', 'true');
            closer.setAttribute('data-close', 'o-drawer');
            closer.setAttribute('data-target', '#foo');

            close.setAttribute('data-close', 'o-drawer');

            document.body.appendChild(element);
            document.body.appendChild(closer);
            element.appendChild(close);
        });

        it('should hide the element and set the correct states', function () {
            var element = document.getElementById('foo')
                ,closer = document.getElementById('closer')
                ,drawer = new Drawer(element);

            closer.click();
            setTimeout(function() {
                expect(isExpanded(element,closer)).to.be(false);
                done();
            }, 100);
        });

/*
        it('should emit oDrawer.close', function(done) {
            var element = document.getElementById('foo')
                ,closer = document.getElementById('closer')
                ,drawer = new Drawer(element);

            element.addEventListener('oDrawer.close', function(e) {
                    expect(e.target).to.be(element);
                    done();
            });

            closer.click();
        });*/

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
        it('should toggle the element open and close', function() {
            var element = document.createElement('div')
                ,toggler = document.createElement('button');

            element.id = 'foo';

            toggler.setAttribute('aria-expanded', 'false');
            toggler.setAttribute('data-toggle', 'o-drawer');
            toggler.setAttribute('data-target', '#foo');

            document.body.appendChild(element);
            document.body.appendChild(toggler);

            var drawer = new Drawer(element);

            toggler.click();//open
            setTimeout(function() {
                    expect(isExpanded(element,trigger)).to.be(true);
                    toggler.click();//close
                    expect(isExpanded(element,trigger)).to.be(false);
                    done();
            }, 100);
        });
    });
});
