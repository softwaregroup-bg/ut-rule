import joi from 'joi-browser';

/** Joi API ref: https://github.com/hapijs/joi/blob/v9.2.0/lib/language.js */
let schema = joi.object().keys({
    condition: joi.array().items(
        joi.object().keys({
            priority: joi.number().integer().min(1).required().options({
                language: {
                    key: '"Priority" ',
                    string: {
                        min: 'is required for all conditions',
                        number: 'is required for all conditions'
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
            }),
            minAmount: joi.number().max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Min Value" '
                }
            }),
            maxAmount: joi.number().max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Value" '
                }
            }),
            maxAmountDaily: joi.number().max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Daily Value" '
                }
            }),
            maxCountDaily: joi.number().integer().min(0).max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Count Daily Value" '
                }
            }),
            maxAmountWeekly: joi.number().max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Weekly Value" '
                }
            }),
            maxCountWeekly: joi.number().integer().min(0).max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Count Weekly Value" '
                }
            }),
            maxAmountMonthly: joi.number().max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Monthly Value" '
                }
            }),
            maxCountMonthly: joi.number().integer().min(0).max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Count Monthly Value" '
                }
            }),
            maxCountLifetime: joi.number().integer().min(0).max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Count Lifetime Value" '
                }
            }),
            maxAmountLifetime: joi.number().max(999999).optional().allow(null).allow('').options({
                language: {
                    key: '"Transaction Limit Max Amount Lifetime Value" '
                }
            })
        })
    ),
    split: joi.array().items(
        joi.object().keys({
            splitName: joi.object().keys({
                name: joi.string().required().options({
                    language: {
                        key: '"Split Name" ',
                        string: {
                            base: 'is required for all splits'
                        }
                    }
                })
            }),
            splitRange: joi.array().items(
                joi.object().keys({
                    startAmount: joi.number().min(1).max(999999).required().options({
                        language: {
                            key: '"Range Start Amount" ',
                            number: {
                                base: 'is required for all splits'
                            }
                        }
                    }),
                    startAmountCurrency: joi.string().required().options({
                        language: {
                            key: '"Range Start Amount Currency" ',
                            string: {
                                base: 'is required for all splits'
                            }
                        }
                    }),
                    percent: joi.number().max(999999).optional().allow(null).allow('').options({
                        language: {
                            key: '"Split Percentage Value" '
                        }
                    }),
                    minValue: joi.number().max(999999).optional().allow(null).allow('').options({
                        language: {
                            key: '"Split Range Min Amount Value" '
                        }
                    }),
                    maxValue: joi.number().max(999999).optional().allow(null).allow('').options({
                        language: {
                            key: '"Split Range Max Amount Value" '
                        }
                    })
                })
            ),
            splitAssignment: joi.array().items(
                joi.object().keys({
                    debit: joi.string().required().options({
                        language: {
                            key: '"Assignment Debit" ',
                            string: {
                                base: 'is required for all splits'
                            }
                        }
                    }),
                    credit: joi.string().required().options({
                        language: {
                            key: '"Assignment Credit" ',
                            string: {
                                base: 'is required for all splits'
                            }
                        }
                    }),
                    description: joi.string().required().options({
                        language: {
                            key: '"Assignment Description" ',
                            string: {
                                base: 'is required for all splits'
                            }
                        }
                    }),
                    percent: joi.number().max(999999).optional().allow(null).allow('').options({
                        language: {
                            key: '"Assignment Percentage Value" '
                        }
                    }),
                    minValue: joi.number().max(999999).optional().allow(null).allow('').options({
                        language: {
                            key: '"Assignment Range Min Amount Value" '
                        }
                    }),
                    maxValue: joi.number().max(999999).optional().allow(null).allow('').options({
                        language: {
                            key: '"Assignment Range Max Amount Value" '
                        }
                    })
                })
            )
        })
    )
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
