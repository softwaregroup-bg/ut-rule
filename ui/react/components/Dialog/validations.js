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
                     dailyAmount: joi.number().max(joi.ref('weeklyAmount')).options({
                         language: {
                             key: '"Daily Amount" ',
                             number: {
                                 max: '1should be smaller than Weekly Amount',
                                 base: 'is required for all splits cumulatives'
                             }
                         }
                     }),
                     dailyCount: joi.number().max(joi.ref('weeklyCount')).options({
                         language: {
                             key: '"Daily Count" ',
                             number: {
                                 max: 'should be smaller than Weekly Count',
                                 base: 'is required for all splits cumulatives'
                             }
                         }
                     }),
                     weeklyAmount: joi.number().min(joi.ref('dailyAmount')).max(joi.ref('mounthlyAmount')).options({
                         language: {
                             key: '"Weekly Amount" ',
                             number: {
                                 max: 'should be bigger than Daily Amount',
                                 min: 'should be smaller than Monthly Amount',
                                 base: 'is required for all splits cumulatives'
                             }
                         }
                     }),
                     weeklyCount: joi.number().min(joi.ref('dailyCount')).max(joi.ref('mounthlyCount')).options({
                         language: {
                             key: '"Weekly Count" ',
                             number: {
                                 max: 'should be bigger than Daily Count',
                                 min: 'should be smaller than Monthly Count',
                                 base: 'is required for all splits cumulatives'
                             }
                         }
                     }),
                     mounthlyAmount: joi.number().min(joi.ref('weeklyAmount')).options({
                         language: {
                             key: '"Mounthly Amount" ',
                             number: {
                                 min: 'should be bigger than Weekly Amount',
                                 base: 'is required for all splits cumulatives'
                             }
                         }
                     }),
                     mounthlyCount: joi.number().min(joi.ref('weeklyCount'))
                     .options({
                         language: {
                             key: '"Mounthly Count" ',
                             number: {
                                 min: 'should be bigger than Weekly Count',
                                 base: 'is required for all splits cumulatives'
                             }
                         }
                     }),
                     splitRange: joi.array().items(
                        joi.object().keys({
                            isSourceAmount: joi.boolean(),
                            maxValue: joi.number().min(joi.ref('minValue')).options({
                                language: {
                                    key: '"Range" ',
                                    number: {
                                        min: 'Max Amount should not be bigger than Min Amount',
                                        base: 'is required for all splits cumulatives'
                                    }
                                }
                            }),
                            minValue: joi.number().max(joi.ref('maxValue')).options({
                                language: {
                                    key: '"Range" ',
                                    number: {
                                        max: 'Min Amount should not be smaller than Max Amount',
                                        base: 'is required for all splits cumulatives'
                                    }
                                }
                            }),
                            percent: joi.number().options({
                                language: {
                                    key: '"Range" ',
                                    string: {
                                        base: 'is required for all splits cumulatives'
                                    }
                                }
                            }),
                            startAmount: joi.number().options({
                                language: {
                                    key: '"Range" ',
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
