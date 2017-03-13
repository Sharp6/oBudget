define(['knockout', 'jquery',
  'text!/components/years/years.template.client.html', '/components/years/years.vm.client.js',
  'text!/components/categories/categories.template.client.html', '/components/categories/categories.vm.client.js'
],
function(ko,$, yearsTemplate, yearsVM, categoriesTemplate, categoriesVM) {
  ko.components.register('years', {
      viewModel: yearsVM,
      template: yearsTemplate
  });
  ko.components.register('categories', {
      viewModel: categoriesVM,
      template: categoriesTemplate
  });
});
