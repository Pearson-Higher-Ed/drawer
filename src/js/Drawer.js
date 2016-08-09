/* jshint -W079 */

'use strict';

var DomDelegate = require('dom-delegate');
var WeakMap = require('./weakmap/main');

var dispatchEvent = function(element, name, data) {
	if (document.createEvent && element.dispatchEvent) {
		var event = document.createEvent('Event');
		event.initEvent(name, true, true);

		if (data) {
			event.detail = data;
		}

		element.dispatchEvent(event);
	}
};

function Drawer(el){
	if (!(this instanceof Drawer)){
		throw new TypeError('Constructor Drawer requires \'new\'');
	}
	if (!el){
		throw new TypeError('missing required argument: element');
	}
	if(typeof el === 'string'){
		el = document.querySelector(el);
	}

//	var triggerSelector =
//		'[data-toggle="o-drawer"][href="#' + el.id + '"],' +
//		'[data-toggle="o-drawer"][data-target="#' + el.id + '"]';
//      this.trigger = document.querySelectorAll(triggerSelector);
//	this.target.setAttribute('aria-expanded', false);

	this.target = el;
	this.currentTarget = false;
        this.close_button;
        this.trigger; //what opened the drawer
        this.target.style.display ='none'; //don't tab through hidden drawers
	Drawer.cache.set(el, this);

	this.target.classList.add('o-drawer');

	var hasAlignmentClass = this.target.classList.contains('o-drawer-left') ||
		this.target.classList.contains('o-drawer-right');

	if(!hasAlignmentClass){
		this.target.classList.add('o-drawer-left');
	}

        // this is flawed, it will also catch focusables inside
        // display:none/visibility-hidden containers
        this.focusables = Array.prototype.slice.call(this.target.querySelectorAll(
          '[tabindex="0"], a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'));

        for (var i=0, l=this.focusables.length; i<l; i++) {
          var f = this.focusables[i];
          if (f.hasAttribute('data-close')) {
            this.close_button = f;
            break;
          }
        }
        this.first_focusable = this.close_button || this.focusables[0];
        this.last_focusable = this.focusables[this.focusables.length-1];


	if(!Drawer.delegate){
		var delegate = new DomDelegate(document.body);
		delegate.on('click', '[data-toggle="o-drawer"], [data-close="o-drawer"], [data-open="o-drawer"]', function handleClick(e) {
			e.preventDefault();


			var trigger = getTrigger(e.target);
			var target = getTargetFromTrigger(trigger);

                  // why looping? with href we can only get 1 element because it's an id
			for(var i=0, l = target.length; i<l; i++){
				var t = target[i];
				var drawer = Drawer.cache.get(t);

				if (!drawer && t.getAttribute('data-o-component') === 'o-collapse') {
					drawer = new Drawer(t);
				}

				if (drawer) {
					var action = openCloseToggle(trigger);
					drawer[action]();
				}
			}
		});
		Drawer.delegate = delegate;
	}
	var _this = this;
	document.addEventListener('o.Drawer.RightDrawer', function() {
		if(_this.target.classList.contains('o-drawer-right') && !_this.currentTarget) {
			_this.close();
		}
		_this.currentTarget = false;
	});

	document.addEventListener('o.Drawer.LeftDrawer', function() {
		if(_this.target.classList.contains('o-drawer-left') && !_this.currentTarget) {
			_this.close();
		}
		_this.currentTarget = false;
	});

	return this;
}

Drawer.cache = new WeakMap();

/**
 * Initializes all drawer elements on the page or within
 * the element passed in.
 * @param	{HTMLElement|string} element DOM element or selector.
 * @return {DropdownMenu[]} List of Drawer instances that
 * have been initialized.
 */
Drawer.init = function(element){
	var drawerEls = selectAll(element);
	var drawers = [];

	for(var i = 0, l = drawerEls.length; i < l; i++){
		drawers.push(new Drawer(drawerEls[i]));
	}

	return drawers;
};

/**
 * Destroy all Drawer Components on the page
 */
Drawer.destroy = function () {
	if (Drawer.bodyDelegate) {
		Drawer.bodyDelegate.destroy();
	}
};

/**
 * Opens the Drawer
 * @return {Drawer} self, for chainability
 */

Drawer.prototype.open = function(){
    if (this.target.classList.contains('o-drawer-open')) {
      // should we re-focus into the Drawer?
      return this;
    }
    this.currentTarget = true;
    this.trigger = document.activeElement; 
    var control = this.trigger
        ,t = this.target
        ,close_button = this.close_button
        ,first_focusable = this.first_focusable;

    if(t.classList.contains('o-drawer-right')) {
      dispatchEvent(t, 'o.Drawer.RightDrawer');
    }
    if(t.classList.contains('o-drawer-left')) {
      dispatchEvent(t, 'o.Drawer.LeftDrawer');
    }
    t.style.display = 'block';

    setTimeout(function(control, first_focusable){
      t.classList.add('o-drawer-open');
      control.setAttribute('aria-expanded', 'true');
      first_focusable.focus();
    }.bind(this, control, first_focusable), 50);

    var _this = this;
    t.addEventListener('keydown', function(e) {
      _this.trapFocus(e);
    });

    dispatchEvent(t, 'oDrawer.open');
    return this;
};

/**
* Closes the Drawer
* @return {Drawer} self, for chainability
*/

Drawer.prototype.close = function() {  
    if (!this.target.classList.contains('o-drawer-open')) {
      this.trigger = document.activeElement;
      return this;
    }
    this.target.classList.remove('o-drawer-open');
    this.trigger.setAttribute('aria-expanded', 'false');

    var t = this.target
        ,closed_from_within = containedIn(document.activeElement, t);

    if(t.classList.contains('o-drawer-animated')){
      setTimeout(function(){
        t.style.display = 'none';
      }, 400);
    }
    else {
        t.style.display = 'none';
    }

    // for the weird instance where drawer is closed externally, 
    // don't focus on the original trigger
    if (closed_from_within) {
      this.trigger.focus();
    }

    dispatchEvent(this.target, 'oDrawer.close');

    return this;
};

/**
* Toggles the Drawer
* @return {Drawer} self, for chainability
*/

Drawer.prototype.toggle = function(){
	var visible = this.target.classList.contains('o-drawer-open');
	if(visible){
		this.close();
	}
	else{
		this.open();
	}
	return this;
};

/**
* Traps tab-focus in the Drawer
*/

// this fails if spatial focus is used!!!
// please use aria-hidden on the rest of the page if possible
// or otherwise disable all non-Drawer focusables
Drawer.prototype.trapFocus = function(e) {
    var t = this.target
        ,active = document.activeElement
        ,last_focusable = this.last_focusable
        ,first_focusable = this.first_focusable
        ,code = e.keyCode;

    // esc
    if (code===27) {
      this.close();
    }

    // tab
    if (code===9) {
      if (this.focusables.length === 1) {
        e.preventDefault();
      } 
      if (!e.shiftKey) {
        if (active === last_focusable) {
          e.preventDefault();
          first_focusable.focus();
        }
      }
      else {
        if (active === first_focusable) {
          e.preventDefault();
          last_focusable.focus();
        }
      }
    }
};


function containedIn(child, t) {
    while ((child = child.parentNode) && (child !== t));
    return child;
}

function selectAll(element){
	if(!element){
		element = document.body;
	}
	else if(!(element instanceof HTMLElement)){
		element = document.querySelectorAll(element)[0];
	}

	return element.querySelectorAll('[data-o-component="o-drawer"]');
}

function openCloseToggle(el) {
	if(el){
		if(el.getAttribute('data-toggle') === 'o-drawer'){
			return 'toggle';
		}
		else if(el.getAttribute('data-close') === 'o-drawer'){
			return 'close';
		}
		else if(el.getAttribute('data-open') === 'o-drawer'){
			return 'open';
		}
	}
	return false;
}

function getTrigger(element) {
	while (element && element.getAttribute('data-toggle') !== 'o-drawer' &&
					element.getAttribute('data-close') !== 'o-drawer' &&
					element.getAttribute('data-open') !== 'o-drawer') {
		element = element.parentElement;
	}

	return element;
}

function getTargetFromTrigger(element) {
	var target = element.getAttribute('data-target') || element.getAttribute('href');
	return document.querySelectorAll(target);
}

module.exports = Drawer;
