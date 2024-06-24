"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.getSingle = exports.remove = exports.update = exports.create = void 0;
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const create = async (newUser) => {
    const exists = await user_1.UserSchemaModel.findOne({ email: newUser.email });
    if (exists) {
        throw new Error(`Email ${newUser.email} already exists`);
    }
    const user = new user_1.UserSchemaModel(newUser);
    user.password = await bcryptjs_1.default.hash(newUser.password, 12);
    return await user.save().then((res) => {
        return res;
    });
};
exports.create = create;
const update = async (updatingUser) => {
    const updatedUser = await user_1.UserSchemaModel.findByIdAndUpdate(updatingUser.id, updatingUser);
    if (!updatedUser) {
        throw new Error(`User ${updatingUser.email} does not exist`);
    }
};
exports.update = update;
const remove = async (removingUserId) => {
    const removedUser = await user_1.UserSchemaModel.findByIdAndDelete(removingUserId);
    if (!removedUser) {
        throw new Error(`User ${removingUserId} does not exist`);
    }
};
exports.remove = remove;
const getSingle = async (gettingUserId) => {
    const existingUser = await user_1.UserSchemaModel.findById(gettingUserId);
    if (!existingUser) {
        throw new Error(`User ${gettingUserId} does not exist`);
    }
    return existingUser;
};
exports.getSingle = getSingle;
const search = async (searchCriteria) => {
    const conditions = {};
    if (searchCriteria.email) {
        conditions.email = { $regex: new RegExp(`^${searchCriteria.email}`), $options: 'i' };
    }
    if (searchCriteria.firstName) {
        conditions.firstName = { $regex: new RegExp(`^${searchCriteria.firstName}`), $options: 'i' };
    }
    if (searchCriteria.lastName) {
        conditions.lastName = { $regex: new RegExp(`^${searchCriteria.lastName}`), $options: 'i' };
    }
    const requirePagination = searchCriteria.pageNumber && searchCriteria.pageSize;
    const aggregateSearchResults = await user_1.UserSchemaModel.aggregate([
        { $match: conditions },
        { $sort: { name: 1 } },
        {
            $facet: {
                counter: [
                    { $count: 'totalCount' }
                ],
                paginatedResults: [
                    ...(requirePagination
                        ? [
                            { $skip: (searchCriteria.pageNumber - 1) * searchCriteria.pageSize },
                            { $limit: searchCriteria.pageSize }
                        ]
                        : [])
                ]
            }
        }
    ]);
    const totalCount = aggregateSearchResults[0].counter[0].totalCount;
    const pageSize = requirePagination ? searchCriteria.pageSize : totalCount;
    const currentPageNumber = requirePagination ? searchCriteria.pageNumber : 1;
    const result = {
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageSize: pageSize,
        pageNumber: currentPageNumber,
        records: aggregateSearchResults[0].paginatedResults
    };
    return result;
};
exports.search = search;
