(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['map-info-projects.tpl.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "      <div class=\"image-comp image-comp--before\">\n        <img src=\""
    + alias2(alias1((depth0 != null ? depth0.beforeImage : depth0), depth0))
    + "\" alt=\""
    + alias2(alias1((depth0 != null ? depth0.RelatedEnglishTitle : depth0), depth0))
    + " before image\">\n      </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "      <div class=\"image-comp image-comp--after\">\n        <img src=\""
    + alias2(alias1((depth0 != null ? depth0.afterImage : depth0), depth0))
    + "\" alt=\""
    + alias2(alias1((depth0 != null ? depth0.RelatedEnglishTitle : depth0), depth0))
    + " after image\">\n      </div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.miscImages : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <img class=\"misc-image\" src=\""
    + alias2(alias1(depth0, depth0))
    + "\" alt=\""
    + alias2(alias1((depth0 != null ? depth0.RelatedEnglishTitle : depth0), depth0))
    + " misc image\">\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<article class=\"project project--projects\">\n  <div class=\"project__top\">\n    <header class=\"project__header\">\n      <div class=\"project__date\">"
    + alias2(alias1((depth0 != null ? depth0.YearofFinsihing : depth0), depth0))
    + "</div>\n      <h2 class=\"project__title\">"
    + alias2(alias1((depth0 != null ? depth0.RelatedEnglishTitle : depth0), depth0))
    + "</h2>\n    </header>\n    <aside class=\"project__details\">\n      <div class=\"project__details__item project__period\">\n        <div class=\"details__item__label\">Period</div>\n        <div class=\"details__item__value\">"
    + alias2(alias1((depth0 != null ? depth0.Period : depth0), depth0))
    + "</div>\n      </div>\n      <div class=\"project__details__item project__budget\">\n        <div class=\"details__item__label\">Budget</div>\n        <div class=\"details__item__value\">"
    + alias2(alias1((depth0 != null ? depth0.Cost : depth0), depth0))
    + "</div>\n      </div>\n      <div class=\"project__details__item project__beneficary\">\n        <div class=\"details__item__label\">Beneficiary</div>\n        <div class=\"details__item__value\">"
    + alias2(alias1((depth0 != null ? depth0.Beneficary : depth0), depth0))
    + "</div>\n      </div>\n      <div class=\"project__details__item project__phase\">\n        <div class=\"details__item__label\">Phase</div>\n        <div class=\"details__item__value\">"
    + alias2(alias1((depth0 != null ? depth0.phase : depth0), depth0))
    + "</div>\n      </div>\n    </aside>\n  </div>\n  <div class=\"project__mid\">\n"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.beforeImage : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.afterImage : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n  <div class=\"project__bottom\">\n    <p class=\"project__description\">\n      "
    + alias2(alias1((depth0 != null ? depth0.Text : depth0), depth0))
    + "\n    </p>\n"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.miscImages : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n</article>\n";
},"useData":true});
})();