import joi from 'joi-browser';

/** Joi API ref: https://github.com/hapijs/joi/blob/v9.2.0/lib/language.js */
let schema = joi.object().keys({
    channelProperties: joi.array().items(
        joi.object().keys({
            name: joi.string().required().options({
                language: {
                    key: '"Channel" ',
                    string: {
                        base: 'Property fields cannot be empty'
                    }
                }
            }),
            value: joi.string().required().options({
                language: {
                    key: '"Channel" ',
                    string: {
                        base: 'Property fields cannot be empty'
                    }
                }
            })
        })
    ).unique((a, b) => a.name === b.name).options({
        language: {
            key: '"Channel" ',
            array: {
                unique: 'properties cannot contain the same names'
            }
        }
    }),
    operationProperties: joi.array().items(
        joi.object().keys({
            name: joi.string().required().options({
                language: {
                    key: '"Operation" ',
                    string: {
                        base: 'Property fields cannot be empty'
                    }
                }
            }),
            value: joi.string().required().options({
                language: {
                    key: '"Operation" ',
                    string: {
                        base: 'Property fields cannot be empty'
                    }
                }
            })
        })
    ).unique((a, b) => a.name === b.name).options({
        language: {
            key: '"Operation" ',
            array: {
                unique: 'properties cannot contain the same names'
            }
        }
    }),
    sourceProperties: joi.array().items(
        joi.object().keys({
            name: joi.string().required().options({
                language: {
                    key: '"Source" ',
                    string: {
                        base: 'Property fields cannot be empty'
                    }
                }
            }),
            value: joi.string().required().options({
                language: {
                    key: '"Source" ',
                    string: {
                        base: 'Property fields cannot be empty'
                    }
                }
            })
        })
    ).unique((a, b) => a.name === b.name).options({
        language: {
            key: '"Source" ',
            array: {
                unique: 'properties cannot contain the same names'
            }
        }
    }),
    destinationProperties: joi.array().items(
        joi.object().keys({
            name: joi.string().required().options({
                language: {
                    key: '"Destination" ',
                    string: {
                        base: 'Property fields cannot be empty'
                    }
                }
            }),
            value: joi.string().required().options({
                language: {
                    key: '"Destination" ',
                    string: {
                        base: 'Property fields cannot be empty'
                    }
                }
            })
        })
    ).unique((a, b) => a.name === b.name).options({
        language: {
            key: '"Destination" ',
            array: {
                unique: 'properties cannot contain the same names'
            }
        }
    }),
    condition: joi.array().items(
        joi.object().keys({
            priority: joi.number().integer().min(1).max(2147483647).required().options({
                language: {
                    key: '"Priority" ',
                    number: {
                        base: 'is required for all conditions and should be a integer'
                    }
                }
            }),
            channelOrganizationId: joi.number().integer().required().options({
                language: {
                    key: '"Business Unit" ',
                    number: {
                        base: 'field is mandatory, select a value.'
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
            maxAmountDaily: joi.string().allow(null).allow('').regex(/(^\s+$|^$|^\d+$)/).options({
                language: {
                    key: '"Limit" ',
                    string: {
                        base: 'All limits fields should be integers',
                        regex: {
                            base: 'All limits fields should be integers'
                        }
                    }
                }
            }),
            maxAmountMonthly: joi.string().allow(null).allow('').regex(/(^\s+$|^$|^\d+$)/).options({
                language: {
                    key: '"Limit" ',
                    string: {
                        base: 'All limits fields should be integers',
                        regex: {
                            base: 'All limits fields should be integers'
                        }
                    }
                }
            }),
            maxAmountWeekly: joi.string().allow(null).allow('').regex(/(^\s+$|^$|^\d+$)/).options({
                language: {
                    key: '"Limit" ',
                    string: {
                        base: 'All limits fields should be integers',
                        regex: {
                            base: 'All limits fields should be integers'
                        }
                    }
                }
            }),
            maxCountDaily: joi.string().allow(null).allow('').regex(/(^\s+$|^$|^\d+$)/).options({
                language: {
                    key: '"Limit" ',
                    string: {
                        base: 'All limits fields should be integers',
                        regex: {
                            base: 'All limits fields should be integers'
                        }
                    }
                }
            }),
            maxCountMonthly: joi.string().allow(null).allow('').regex(/(^\s+$|^$|^\d+$)/).options({
                language: {
                    key: '"Limit" ',
                    string: {
                        base: 'All limits fields should be integers',
                        regex: {
                            base: 'All limits fields should be integers'
                        }
                    }
                }
            }),
            maxCountWeekly: joi.string().allow(null).allow('').regex(/(^\s+$|^$|^\d+$)/).options({
                language: {
                    key: '"Limit" ',
                    string: {
                        base: 'All limits fields should be integers',
                        regex: {
                            base: 'All limits fields should be integers'
                        }
                    }
                }
            }),
            minAmount: joi.string().allow(null).allow('').regex(/(^\s+$|^$|^\d+$)/).options({
                language: {
                    key: '"Limit" ',
                    string: {
                        base: 'All limits fields should be integers',
                        regex: {
                            base: 'All limits fields should be integers'
                        }
                    }
                }
            }),
            maxAmount: joi.string().allow(null).allow('').regex(/(^\s+$|^$|^\d+$)/).options({
                language: {
                    key: '"Limit" ',
                    string: {
                        base: 'All limits fields should be integers',
                        regex: {
                            base: 'All limits fields should be integers'
                        }
                    }
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
                        number: {
                            base: 'is required for all splits'
                        }
                    }
                })
            }),
            splitCumulative: joi.array().items(
                 joi.object().keys({
                     currency: joi.string().required().options({
                         language: {
                             key: '"Currency" ',
                             number: {
                                 base: 'is required for all splits cumulatives'
                             }
                         }
                     }),
                     dailyAmount: joi.number().allow('').allow(null).max(joi.ref('weeklyAmount')).options({
                         language: {
                             key: '"Daily Amount" ',
                             number: {
                                 max: 'should be smaller than Weekly Amount'
                             }
                         }
                     }),
                     dailyCount: joi.number().allow('').allow(null).max(joi.ref('weeklyCount')).options({
                         language: {
                             key: '"Daily Count" ',
                             number: {
                                 max: 'should be smaller than Weekly Count'
                             }
                         }
                     }),
                     weeklyAmount: joi.number().allow('').allow(null).min(joi.ref('dailyAmount')).max(joi.ref('mounthlyAmount')).options({
                         language: {
                             key: '"Weekly Amount" ',
                             number: {
                                 max: 'should be bigger than Daily Amount',
                                 min: 'should be smaller than Monthly Amount'
                             }
                         }
                     }),
                     weeklyCount: joi.number().allow('').allow(null).min(joi.ref('dailyCount')).max(joi.ref('mounthlyCount')).options({
                         language: {
                             key: '"Weekly Count" ',
                             number: {
                                 max: 'should be bigger than Daily Count',
                                 min: 'should be smaller than Monthly Count'
                             }
                         }
                     }),
                     mounthlyAmount: joi.number().allow('').allow(null).min(joi.ref('weeklyAmount')).options({
                         language: {
                             key: '"Mounthly Amount" ',
                             number: {
                                 min: 'should be bigger than Weekly Amount'
                             }
                         }
                     }),
                     mounthlyCount: joi.number().allow('').allow(null).min(joi.ref('weeklyCount'))
                     .options({
                         language: {
                             key: '"Mounthly Count" ',
                             number: {
                                 min: 'should be bigger than Weekly Count'
                             }
                         }
                     }),
                     splitRange: joi.array().items(
                        joi.object().keys({
                            isSourceAmount: joi.boolean(),
                            maxValue: joi.number().allow('').allow(null),
                            minValue: joi.number().allow('').allow(null),
                            percent: joi.number().allow('').allow(null),
                            startAmount: joi.number().required().allow(0).options({
                                language: {
                                    key: '"Range Start Amount" ',
                                    string: {
                                        base: 'is required for all splits cumulatives'
                                    }
                                }
                            })
                        })
                     ).min(1).options({
                         language: {
                             key: '"Cumulative Ranges" ',
                             string: {
                                 base: 'are required for all splits cumulatives'
                             }
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
