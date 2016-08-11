(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['nav-cat.tpl.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"category-wrapper category-wrapper--"
    + alias2(alias1((depth0 != null ? depth0.title : depth0), depth0))
    + "\">\n  <i class=\"map__nav__item__icon\"></i>\n  <span class=\"map__nav__item__name\">"
    + alias2(alias1((depth0 != null ? depth0.title : depth0), depth0))
    + "</span>\n</div>\n";
},"useData":true});
})();