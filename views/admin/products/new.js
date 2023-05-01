const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
  return layout({
    content: `
            <form method="POST" enctype="">
                <input placeholder="Title" name="title" />
                ${getError(errors, 'title')}
                <input placeholder="Price" name="price" />
                ${getError(errors, 'price')}
                <input type="file" name="image" />
                <button>Submit</button>
            </form>
        `,
  });
};