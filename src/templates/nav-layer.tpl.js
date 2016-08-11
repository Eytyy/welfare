(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['nav-layer.tpl.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<span class=\"map__nav__item map__nav__item--project\" data-target=\""
    + ((stack1 = alias1((depth0 != null ? depth0.title : depth0), depth0)) != null ? stack1 : "")
    + "\" data-cat="
    + alias2(alias1((depth0 != null ? depth0.cat : depth0), depth0))
    + ">\n  <span class=\"map__nav__item__title\">"
    + alias2(alias1((depth0 != null ? depth0.title : depth0), depth0))
    + "</span>\n</span>\n";
},"useData":true});
})();