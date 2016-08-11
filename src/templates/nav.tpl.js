(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['nav.tpl.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "    <div class=\"map__nav__item-wrapper map__nav__item-wrapper--"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\">\n      <a href=\"#"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\" class=\"map__nav__item map__nav__item--layer map__nav__item--"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\">\n        <i class=\"map__nav__item__icon\"></i>\n        <span class=\"map__nav__item__name\">"
    + alias2(alias1((depth0 != null ? depth0.title : depth0), depth0))
    + "</span>\n      </a>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div  id=\"map_nav\" class=\"map__nav\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
})();