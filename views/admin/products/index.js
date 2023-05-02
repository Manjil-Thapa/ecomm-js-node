const layout = require('../layout');

module.exports = ({ products }) => {
  // map over prods and for every prod, return snippet of html
  const renderedProducts = products
    .map(product => {
      return `
            <div>${product.title}</div>
        `;
    })
    .join(''); //join them tght into one big str
  return layout({
    content: `
            <h1 class="title">All Products</h1>
            ${renderedProducts}
        `,
  });
};
