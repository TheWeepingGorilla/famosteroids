/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var PhysicsEngine = require ('famous/physics/PhysicsEngine');
    var Circle = require('famous/physics/bodies/Circle');
    var Body = require('famous/physics/bodies/Body');
    var Vector = require('famous/math/Vector');
    // create the main context
    var mainCon = Engine.createContext();

    // your app here
    var physicsEng = new PhysicsEngine();

    mainCon.setPerspective(1000);

    var shipArray = [];
    var Ship = function Ship(shipAlign, shipOrigin) {
      this.surface = new ImageSurface({
        size:[52,52],
        content: '/content/images/AsteroidsShip_color.gif'
      });
      this.alignment = shipAlign;
      this.state = new StateModifier({
        align: shipAlign,
        origin: shipOrigin
      });
      this.particle = new Circle({radius:20});
      this.direction = 0.0; //radians
      this.rotationModifier = function() {
        return new StateModifier({ transform: Transform.rotateZ(this.direction) });
      };
      this.setXY = function() {
        var X = this.velocity * Math.cos(this.direction);
        var Y = this.velocity * Math.sin(this.direction);
        this.particle.setVelocity([X,Y,0]);
      };
      this.addVector = function() {
        var vecToAdd = new Vector(0.1 * Math.cos(this.direction), 0.1 * Math.sin(this.direction), 0);
        console.log("Vector to add: " + vecToAdd.get());
        var currentVec = new Vector(this.particle.getVelocity()[0], this.particle.getVelocity()[1], 0);
        console.log("CurrentVector: " + currentVec.get());
        currentVec = currentVec.add(vecToAdd);
        console.log("Resultant: " + currentVec.get());
        this.particle.setVelocity(currentVec.get()[0], currentVec.get()[1], 0);
      };
    };

    var ship0 = new Ship([0.5,0.5],[0.5,0.5]);
    physicsEng.addBody(ship0.particle);
    shipArray.push(ship0);
    mainCon.add(ship0.state).add(ship0.rotationModifier()).add(ship0.surface);

    Engine.on('keydown', function(e) {
      if (e.which === 65) {
        ship0.direction -= Math.PI / 20;
        mainCon.add(ship0.state).add(ship0.rotationModifier()).add(ship0.surface);
        console.log(ship0.direction);
      } else if (e.which === 68) {
        ship0.direction += Math.PI / 20;
        mainCon.add(ship0.state).add(ship0.rotationModifier()).add(ship0.surface);
        console.log(ship0.direction);
      } else if (e.which === 87) {
        ship0.addVector();
        console.log(ship0.velocity);
      };
    });


    // var logo = new ImageSurface({
    //     size: [200, 200],
    //     content: '/content/images/famous_logo.png',
    //     classes: ['backfaceVisibility']
    // });

    // var initialTime = Date.now();
    // var centerSpinModifier = new Modifier({
    //     align: [0.5, 0.5],
    //     origin: [0.5, 0.5],
    //     transform: function() {
    //         return Transform.rotateY(.002 * (Date.now() - initialTime));
    //     }
    // });

    // mainCon.add(centerSpinModifier).add(logo);
});
