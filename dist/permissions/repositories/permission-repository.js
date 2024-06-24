"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.getSingle = exports.remove = exports.update = exports.create = void 0;
const permission_1 = require("../models/permission");
const create = async (newPermission) => {
    const exists = await permission_1.PermissionSchemaModel.findOne({ name: newPermission.name, domain: newPermission.applicationName });
    if (exists) {
        throw new Error(`Permission ${newPermission.name} already exists`);
    }
    const Permission = new permission_1.PermissionSchemaModel(newPermission);
    return await Permission.save().then((res) => {
        return res;
    });
};
exports.create = create;
const update = async (updatingPermission) => {
    const updatedPermission = await permission_1.PermissionSchemaModel.findByIdAndUpdate(updatingPermission.id, updatingPermission);
    if (!updatedPermission) {
        throw new Error(`Permission ${updatingPermission.name} does not exist`);
    }
};
exports.update = update;
const remove = async (removingPermissionId) => {
    const removedPermission = await permission_1.PermissionSchemaModel.findByIdAndDelete(removingPermissionId);
    if (!removedPermission) {
        throw new Error(`Permission ${removingPermissionId} does not exist`);
    }
};
exports.remove = remove;
const getSingle = async (gettingPermissionId) => {
    const existingPermission = await permission_1.PermissionSchemaModel.findById(gettingPermissionId);
    if (!existingPermission) {
        throw new Error(`Permission ${gettingPermissionId} does not exist`);
    }
    return existingPermission;
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
    if (searchCriteria.applicationName) {
        conditions.lastName = { $regex: new RegExp(`^${searchCriteria.applicationName}`), $options: 'i' };
    }
    const requirePagination = searchCriteria.pageNumber && searchCriteria.pageSize;
    const aggregateSearchResults = await permission_1.PermissionSchemaModel.aggregate([
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
