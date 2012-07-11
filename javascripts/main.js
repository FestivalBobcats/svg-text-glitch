$(function() {

  var paper = Raphael( "canvas", 600, 400 ),
      center = { x: paper.width/2, y: paper.height/2 };

  var charMap;
  $.ajaxSetup({ async: false });
  $.getJSON( "/charmap.json", function(data) {
    charMap = data;
  });
  $.ajaxSetup({ async: true });



  function getPathForChar(chr) {

    var idx,
        finder = function(ary, i) { idx = i; return ary[0] == chr; },
        path = _.find( charMap, finder );

    // remove so that duplicate letters in heading aren't used again
    charMap.splice( idx, 1 );

    return path;
  }


  var Letter = function(chr, path, fill) {
    var self = this;

    this.originalPath = path;
    this.path = this.originalPath;
    this.fill = fill;

    function buildNode(path) {
      return paper.path( path ).attr( self.attrs );
    }

    this.render = function() {
      if (self.node) self.node.remove();
      self.node = buildNode( self.path );
    };

    this.explode = function(magnitude) {
      var newPath = [], newPoints, directive;

      self.node.attr( "path" ).forEach( function(segment) {
        directive = segment[0];
        newPoints = [];
        segment.slice(1).forEach( function(n) {
          newPoints.push( (Math.random() - .5) * magnitude + n );
        });

        newPath.push( directive + newPoints.join(",") );
      });

      // self.attrs = { "fill-opacity": 0, stroke: "#000" };
      self.path = newPath.join();
      self.render();
    };

    this.reset = function() {
      self.attrs = { fill: self.fill, "stroke-opacity": 0 };
      self.path = self.originalPath;
      self.render();

      setTimeout( function() {
        self.explode( 20 );
        setTimeout( function() {
          self.explode( 10 );
          setTimeout( function() {
            self.reset();
          }, Math.random() * 300 );
        }, Math.random() * 100 );
      }, Math.random() * 1000 );
    }

    self.reset();

  };

  var Heading = function() {
    var self = this,
        x = center.x,
        y = center.y,
        str = "BENHUNDLEY",
        fill = "#000";

    this.letters = [];

    var chars = str.split("");

    var path, letter;
    chars.forEach( function(chr, idx) {
      path = getPathForChar( chr );
      letter = new Letter( chr, path, fill );
      self.letters.push( letter );
    });

  };

  new Heading();

});