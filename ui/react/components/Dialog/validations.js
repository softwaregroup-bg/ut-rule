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
                        string: {
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
                             string: {
                                 base: 'is required for all splits cumulatives'
                             }
                         }
                     }),
                    //  dailyAmount: joi.string().options({
                    //      language: {
                    //          key: '"Daily Amount" ',
                    //          string: {
                    //              base: 'is required for all splits cumulatives'
                    //          }
                    //      }
                    //  }),
                    //  dailyCount: joi.string().options({
                    //      language: {
                    //          key: '"Daily Count" ',
                    //          string: {
                    //              base: 'is required for all splits cumulatives'
                    //          }
                    //      }
                    //  }),
                    //  mounthlyAmount: joi.string().options({
                    //      language: {
                    //          key: '"Mounthly Amount" ',
                    //          string: {
                    //              base: 'is required for all splits cumulatives'
                    //          }
                    //      }
                    //  }),
                    //  mounthlyCount: joi.string().options({
                    //      language: {
                    //          key: '"Mounthly Count" ',
                    //          string: {
                    //              base: 'is required for all splits cumulatives'
                    //          }
                    //      }
                    //  }),
                    //  weeklyAmount: joi.string().options({
                    //      language: {
                    //          key: '"Weekly Amount" ',
                    //          string: {
                    //              base: 'is required for all splits cumulatives'
                    //          }
                    //      }
                    //  }),
                    //  weeklyCount: joi.string().options({
                    //      language: {
                    //          key: '"Weekly Count" ',
                    //          string: {
                    //              base: 'is required for all splits cumulatives'
                    //          }
                    //      }
                    //  }),
                     splitRange: joi.array().items(
                        joi.object().keys({
                            // isSourceAmount: joi.boolean(),
                            // maxValue: joi.string().options({
                            //     language: {
                            //         key: '"Range" ',
                            //         string: {
                            //             base: 'is required for all splits cumulatives'
                            //         }
                            //     }
                            // }),
                            // minValue: joi.string().options({
                            //     language: {
                            //         key: '"Range" ',
                            //         string: {
                            //             base: 'is required for all splits cumulatives'
                            //         }
                            //     }
                            // }),
                            // percent: joi.string().options({
                            //     language: {
                            //         key: '"Range" ',
                            //         string: {
                            //             base: 'is required for all splits cumulatives'
                            //         }
                            //     }
                            // }),
                            // startAmount: joi.string().options({
                            //     language: {
                            //         key: '"Range" ',
                            //         string: {
                            //             base: 'is required for all splits cumulatives'
                            //         }
                            //     }
                            // })
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
