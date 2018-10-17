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
            maxAmountDaily: joi.string().allow(null).allow('').max(12).regex(/(^\s+$|^$|^\d+$)/).options({
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
            maxAmountMonthly: joi.string().allow(null).allow('').max(12).regex(/(^\s+$|^$|^\d+$)/).options({
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
            maxAmountWeekly: joi.string().allow(null).allow('').max(12).regex(/(^\s+$|^$|^\d+$)/).options({
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
            maxCountDaily: joi.string().allow(null).allow('').max(16).regex(/(^\s+$|^$|^\d+$)/).options({
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
            maxCountMonthly: joi.string().allow(null).allow('').max(16).regex(/(^\s+$|^$|^\d+$)/).options({
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
            maxCountWeekly: joi.string().allow(null).allow('').max(16).regex(/(^\s+$|^$|^\d+$)/).options({
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
            minAmount: joi.string().allow(null).allow('').max(12).regex(/(^\s+$|^$|^\d+$)/).options({
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
            maxAmount: joi.string().allow(null).allow('').max(12).regex(/(^\s+$|^$|^\d+$)/).options({
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
                name: joi.string().trim().required().options({
                    language: {
                        key: '"Split Name" ',
                        number: {
                            base: 'is required for all splits'
                        }
                    }
                }),
                tag: joi.array().min(1)
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
                     splitRange: joi.array().items(
                        joi.object().keys({
                            isSourceAmount: joi.boolean(),
                            percent: joi.number().options({
                                language: {
                                    key: '"Percent" ',
                                    string: {
                                        base: 'is required for all splits cumulatives'
                                    }
                                }
                            }).allow(null, '')
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
                err = {details: []};
            }

            let errors = err.details.reduce((errorArray, current) => {
                if (errorArray.indexOf(current.message) === -1) {
                    errorArray.push(current.message);
                }
                return errorArray;
            }, []);
            const customErrors = customValidation(objToValidate);
            errors = errors.concat(customErrors);

            return {
                isValid: errors.length === 0,
                errors: errors
            };
        });
    },
    isNumber
};

function customValidation(obj) {
    const errors = [];
    if (Array.isArray(obj.split)) {
        for (const split of obj.split) {
            const splitCumulative = split.splitCumulative;
            if (Array.isArray(splitCumulative)) {
                for (const cummulative of splitCumulative) {
                    // amounts
                    if (cummulative.dailyAmount) {
                        if (!isNumber(cummulative.dailyAmount)) {
                            errors.push('Daily Amount must be a number');
                        } else if (isNumber(cummulative.dailyAmount) && cummulative.dailyAmount < 0) {
                            errors.push('Daily Amount must be a positive number');
                        }
                    }

                    if (cummulative.weeklyAmount) {
                        if (cummulative.weeklyAmount && !isNumber(cummulative.weeklyAmount)) {
                            errors.push('Weekly Amount must be a number');
                        } else if (cummulative.weeklyAmount && isNumber(cummulative.weeklyAmount) && cummulative.weeklyAmount < 0) {
                            errors.push('Weekly Amount must be a positive number');
                        }
                    }
                    if (cummulative.mounthlyAmount && !isNumber(cummulative.mounthlyAmount)) {
                        errors.push('Monthly Amount must be a number');
                    } else if (cummulative.mounthlyAmount && isNumber(cummulative.mounthlyAmount) && cummulative.mounthlyAmount < 0) {
                        errors.push('Monthly Amount must be a positive number');
                    }
                    if (isBiggerThan(cummulative.dailyAmount, cummulative.weeklyAmount)) {
                        errors.push('Daily Amount should be smaller than Weekly Amount');
                    }
                    if (isBiggerThan(cummulative.dailyAmount, cummulative.mounthlyAmount)) {
                        errors.push('Daily Amount should be smaller than Monthly Amount');
                    }
                    if (isBiggerThan(cummulative.weeklyAmount, cummulative.mounthlyAmount)) {
                        errors.push('Weekly Amount should be smaller than Monthly Amount');
                    }
                    if (isBiggerThan(cummulative.dailyAmount, cummulative.weeklyAmount)) {
                        errors.push('Daily Amount should be smaller than Weekly Amount');
                    }
                    if (isBiggerThan(cummulative.dailyAmount, cummulative.mounthlyAmount)) {
                        errors.push('Daily Amount should be smaller than Monthly Amount');
                    }
                    if (isBiggerThan(cummulative.weeklyAmount, cummulative.mounthlyAmount)) {
                        errors.push('Weekly Amount should be smaller than Monthly Amount');
                    }
                    // counts
                    if (cummulative.dailyCount && !isNumber(cummulative.dailyCount)) {
                        errors.push('Daily Count must be a number');
                    } else if (cummulative.dailyCount && isNumber(cummulative.dailyCount) && cummulative.dailyCount < 0) {
                        errors.push('Daily Count must be a positive number');
                    }
                    if (cummulative.weeklyCount && !isNumber(cummulative.weeklyCount)) {
                        errors.push('Weekly Count must be a number');
                    } else if (cummulative.weeklyCount && isNumber(cummulative.weeklyCount) && cummulative.weeklyCount < 0) {
                        errors.push('Weekly Count must be a positive number');
                    }
                    if (cummulative.mounthlyCount && !isNumber(cummulative.mounthlyCount)) {
                        errors.push('Monthly Count must be a number');
                    } else if (cummulative.mounthlyCount && isNumber(cummulative.mounthlyCount) && cummulative.mounthlyCount < 0) {
                        errors.push('Monthly Count must be a positive number');
                    }
                    if (isBiggerThan(cummulative.dailyCount, cummulative.weeklyCount)) {
                        errors.push('Daily Count should be smaller than Weekly Count');
                    }
                    if (isBiggerThan(cummulative.dailyCount, cummulative.mounthlyCount)) {
                        errors.push('Daily Count should be smaller than Monthly Count');
                    }
                    if (isBiggerThan(cummulative.weeklyCount, cummulative.mounthlyCount)) {
                        errors.push('Weekly Count should be smaller than Monthly Count');
                    }
              
                    const splitRange = cummulative.splitRange;
                    if (Array.isArray(splitRange)) {
                        for (const range of splitRange) {
                            
                            if (isBiggerThan(range.minValue, range.maxValue)) {
                                errors.push('Range Min Amount should be smaller than Range Max Amount');
                            }
                            if (!isNumber(range.startAmount)) {
                                errors.push('Range Start Amount is required');
                            }

                            if (range.percent && range.percent !=='' && !isNumber(range.percent)) {
                                errors.push('Invalid Range percent');
                            } else if (range.percent && range.percent!=='' && isNumber(range.percent) && range.percent<0) {
                                errors.push('Range Percent must be positive');
                            }

                            if (range.minValue && range.minValue !=='' && !isNumber(range.minValue)) {
                                errors.push('Invalid Range Min Amount');
                            } else if (range.minValue && range.minValue!=='' && isNumber(range.minValue) && range.minValue<0) {
                                errors.push('Range Min Amount must be positive');
                            }

                            if (range.maxValue && range.maxValue !=='' && !isNumber(range.maxValue)) {
                                errors.push('Invalid Range Max Amount');
                            } else if (range.maxValue && range.maxValue !=='' && isNumber(range.maxValue) && range.maxValue<0) {
                                errors.push('Range Max Amount must be positive');
                            }
                        }
                    }
                }
            }

            const splitAssignment = split.splitAssignment;
            if (Array.isArray(splitAssignment)) {
                for (const assignment of splitAssignment) {
                    if (assignment.minValue) {
                        if (assignment.minValue && !isNumber(assignment.minValue)) {
                            errors.push('Assignment Min Amount must be a number');
                        } else if (assignment.minValue && isNumber(assignment.minValue) && assignment.minValue < 0) {
                            errors.push('Assignment Min Amount must be a positive number');
                        }
                    }
                    if (assignment.maxValue) {
                        if (assignment.maxValue && !isNumber(assignment.maxValue)) {
                            errors.push('Assignment Max Amount must be a number');
                        } else if (assignment.maxValue && isNumber(assignment.maxValue) && assignment.maxValue < 0) {
                            errors.push('Assignment Max Amount must be a positive number');
                        }
                    }
                    if (assignment.percent) {
                        if (assignment.percent && !isNumber(assignment.percent)) {
                            errors.push('Assignment percent must be a number');
                        } else if (assignment.percent && isNumber(assignment.percent) && assignment.percent < 0) {
                            errors.push('Assignment percent must be a positive number');
                        }
                    }
                }
            }
        }
    }

    return errors;
}

function isNumber(n) {
    return n !== null && n !== '' && n !== [] && !isNaN(n);
}

function isBiggerThan(n1, n2) {
    return isNumber(n1) && isNumber(n2) && Number(n1) > Number(n2);
}
