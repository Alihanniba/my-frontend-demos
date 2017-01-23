var plugin = function(){

  return function(style){
    var nodes = this.nodes;
    style.define('addcc', function(a, b) {
      console.log('hihihihihihi');
      // var w = document.body.offsetWidth / 100;
      // var h = (a / w) + 'rem'
      //   console.log('hihihihihihi');
      // // return h;
      // return new nodes.Ident('foobar');
      return a.operate('+', b);
    });
  };
};

module.exports = plugin;
