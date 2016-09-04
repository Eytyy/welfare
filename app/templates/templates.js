(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['map-info-projects.tpl.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "        <div class=\"project__details__item project__period\">\n          <div class=\"details__item__label\">Period</div>\n          <div class=\"details__item__value\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.Period : depth0), depth0))
    + "</div>\n        </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "    <div class=\"project__mid\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.beforeImage : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.afterImage : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <div class=\"image-comp image-comp--before\">\n          <img src=\"https://s3.amazonaws.com/eytyy.com/"
    + alias2(alias1((depth0 != null ? depth0.beforeImage : depth0), depth0))
    + "\" alt=\""
    + alias2(alias1((depth0 != null ? depth0.RelatedEnglishTitle : depth0), depth0))
    + " before image\">\n        </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <div class=\"image-comp image-comp--after\">\n          <img src=\"https://s3.amazonaws.com/eytyy.com/"
    + alias2(alias1((depth0 != null ? depth0.afterImage : depth0), depth0))
    + "\" alt=\""
    + alias2(alias1((depth0 != null ? depth0.RelatedEnglishTitle : depth0), depth0))
    + " after image\">\n        </div>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.miscImages : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <img class=\"misc-image\" src=\"https://s3.amazonaws.com/eytyy.com/"
    + alias2(alias1(depth0, depth0))
    + "\" alt=\""
    + alias2(alias1((depth0 != null ? depth0.RelatedEnglishTitle : depth0), depth0))
    + " misc image\">\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "      <ul class=\"links\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.otherFiles : depth0),{"name":"each","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </ul>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "          <li class=\"links__item\">\n            <a href=\"https://s3.amazonaws.com/eytyy.com/"
    + alias1(container.lambda(depth0, depth0))
    + "\">"
    + alias1((helpers.formatFileName || (depth0 && depth0.formatFileName) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"formatFileName","hash":{},"data":data}))
    + "</a>\n          </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<article class=\"project project--projects\">\n  <div class=\"project__top\">\n    <header class=\"project__header\">\n      <div class=\"project__date\">"
    + alias2(alias1((depth0 != null ? depth0.YearofFinsihing : depth0), depth0))
    + "</div>\n      <h2 class=\"project__title\">"
    + alias2(alias1((depth0 != null ? depth0.RelatedEnglishTitle : depth0), depth0))
    + "</h2>\n      <p class=\"project__description\">\n        "
    + alias2(alias1((depth0 != null ? depth0.Text : depth0), depth0))
    + "\n      </p>\n    </header>\n    <aside class=\"project__details\">\n"
    + ((stack1 = helpers["if"].call(alias3,(helpers.ne || (depth0 && depth0.ne) || alias4).call(alias3,(depth0 != null ? depth0.Period : depth0),"Unkown",{"name":"ne","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      <div class=\"project__details__item project__budget\">\n        <div class=\"details__item__label\">Budget</div>\n        <div class=\"details__item__value\">$"
    + alias2((helpers.formatCurr || (depth0 && depth0.formatCurr) || alias4).call(alias3,(depth0 != null ? depth0.Cost : depth0),{"name":"formatCurr","hash":{},"data":data}))
    + "</div>\n      </div>\n      <div class=\"project__details__item project__beneficary\">\n        <div class=\"details__item__label\">Beneficiary</div>\n        <div class=\"details__item__value\">"
    + alias2(alias1((depth0 != null ? depth0.Beneficary : depth0), depth0))
    + "</div>\n      </div>\n      <div class=\"project__details__item project__phase\">\n        <div class=\"details__item__label\">Phase</div>\n        <div class=\"details__item__value\">"
    + alias2(alias1((depth0 != null ? depth0.phase : depth0), depth0))
    + "</div>\n      </div>\n    </aside>\n  </div>\n"
    + ((stack1 = helpers["if"].call(alias3,(helpers.or || (depth0 && depth0.or) || alias4).call(alias3,(depth0 != null ? depth0.beforeImage : depth0),(depth0 != null ? depth0.afterImage : depth0),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  <div class=\"project__bottom\">\n"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.miscImages : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.otherFiles : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n</article>\n";
},"useData":true});
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['map-info.tpl.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"map-info\" draggable=\"true\">\n  <div class=\"map-info__grabber\"><span class=\"grabber__handle\">&#8249;</span></div>\n  <div class=\"map-info__inner\">\n  </div>\n</div>\n";
},"useData":true});
})();
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