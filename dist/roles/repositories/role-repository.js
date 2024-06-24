"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.getSingle = exports.remove = exports.update = exports.create = void 0;
const role_1 = require("../models/role");
const create = async (newRole) => {
    const exists = await role_1.RoleSchemaModel.findOne({ name: newRole.name, domain: newRole.domain });
    if (exists) {
        throw new Error(`Role ${newRole.name} already exists`);
    }
    const Role = new role_1.RoleSchemaModel(newRole);
    return await Role.save().then((res) => {
        return res;
    });
};
exports.create = create;
const update = async (updatingRole) => {
    const updatedRole = await role_1.RoleSchemaModel.findByIdAndUpdate(updatingRole.id, updatingRole);
    if (!updatedRole) {
        throw new Error(`Role ${updatingRole.name} does not exist`);
    }
};
exports.update = update;
const remove = async (removingRoleId) => {
    const removedRole = await role_1.RoleSchemaModel.findByIdAndDelete(removingRoleId);
    if (!removedRole) {
        throw new Error(`Role ${removingRoleId} does not exist`);
    }
};
exports.remove = remove;
const getSingle = async (gettingRoleId) => {
    const existingRole = await role_1.RoleSchemaModel.findById(gettingRoleId);
    if (!existingRole) {
        throw new Error(`Role ${gettingRoleId} does not exist`);
    }
    return existingRole;
};
exports.getSingle = getSingle;
const search = async (searchCriteria) => {
    const conditions = {};
    if (searchCriteria.name) {
        conditions.email = { $regex: new RegExp(`^${searchCriteria.name}`), $options: 'i' };
    }
    if (searchCriteria.description) {
        conditions.firstName = { $regex: new RegExp(`^${searchCriteria.description}`), $options: 'i' };
    }
    if (searchCriteria.domain) {
        conditions.lastName = { $regex: new RegExp(`^${searchCriteria.domain}`), $options: 'i' };
    }
    const requirePagination = searchCriteria.pageNumber && searchCriteria.pageSize;
    const aggregateSearchResults = await role_1.RoleSchemaModel.aggregate([
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
