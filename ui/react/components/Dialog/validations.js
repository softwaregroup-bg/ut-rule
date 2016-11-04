import joi from 'joi-browser';

/** Joi API ref: https://github.com/hapijs/joi/blob/v9.2.0/lib/language.js */
let schema = joi.object().keys({
    condition: joi.array().items(
        joi.object().keys({
            priority: joi.number().min(1).required().options({
                language: {
                    key: '"Priority" ',
                    string: {
                        min: 'is required for all conditions'
                    }
                }
            })
        })
    ),
    fee: joi.array().items(
        joi.object().keys({
            startAmount: joi.number().required().options({
                language: {
                    key: '"Amount" ',
                    number: {
                        base: 'is required for all fees'
                    }
                }
            }),
            startAmountCurrency: joi.string().required().options({
                language: {
                    key: '"Currency" ',
                    string: {
                        base: 'is required for all fees'
                    }
                }
            })
        })
    ),
    limit: joi.array().items(
        joi.object().keys({
            currency: joi.string().required().options({
                language: {
                    key: '"Currency" ',
                    string: {
                        base: 'is required for all limits'
                    }
                }
            })
        })
    ),
    commission: joi.array().required()
});
module.exports = {
    run: (objToValidate, options = {}) => {
        return joi.validate(objToValidate, schema, Object.assign({}, {
            allowUnknown: true,
            abortEarly: false
        }, options), (err, value) => {
            if (!err) {
                return {
                    isValid: true
                };
            }
            let errors = err.details.reduce((errorArray, current) => {
                if (errorArray.indexOf(current.message) === -1) {
                    errorArray.push(current.message);
                }
                return errorArray;
            }, []);
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        });
    }
};
