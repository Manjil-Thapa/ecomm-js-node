const { validationResult } = require('express-validator');

module.exports = {
  handleErrors(templateFunc, dataCallBack) {
    // cutomizable middleware to throw in diff template fn each time
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // call dataCB (optional arg) fn
        let data = {};
        if (dataCallBack) {
          data = await dataCallBack(req);
        }
        return res.send(templateFunc({ errors, ...data }));
      }

      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin');
    }
    next();
  },
};
