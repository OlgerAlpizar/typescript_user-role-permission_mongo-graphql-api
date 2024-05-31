import Permission, { PermissionSchemaModel } from '../models/permission'
import SearchPermission from '../models/search-permission'
import {PaginationResults} from '../../commons/models/pagination-results'
import { FilterQuery } from 'mongoose'

export const create = async (newPermission: Permission): Promise<Permission> => {
    const exists = await PermissionSchemaModel.findOne({ name: newPermission.name,  domain: newPermission.applicationName })
  
    if (exists) {
      throw new Error(`Permission ${newPermission.name} already exists`)
    }

    const Permission = new PermissionSchemaModel(newPermission)

    return await Permission.save().then((res) => {
        return res
      })
}

export const update = async (updatingPermission: Permission): Promise<void> => {
    const updatedPermission = await PermissionSchemaModel.findByIdAndUpdate(updatingPermission.id, updatingPermission)
  
    if (!updatedPermission) {
      throw new Error(`Permission ${updatingPermission.name} does not exist`)
    }
}

export const remove = async (removingPermissionId: String): Promise<void> => {
    const removedPermission = await PermissionSchemaModel.findByIdAndDelete(removingPermissionId)
  
    if (!removedPermission) {
      throw new Error(`Permission ${removingPermissionId} does not exist`)
    }
}

export const getSingle = async (gettingPermissionId: String): Promise<Permission> => {
    const existingPermission = await PermissionSchemaModel.findById(gettingPermissionId)
  
    if (!existingPermission) {
      throw new Error(`Permission ${gettingPermissionId} does not exist`)
    }

    return existingPermission
}

export const search = async (searchCriteria: SearchPermission): Promise<PaginationResults<Permission>> => {

    const conditions: FilterQuery<Permission> = {}

    if(searchCriteria.name){
      conditions.email = { $regex: new RegExp(`^${searchCriteria.name}`), $options: 'i' };
    }

    if(searchCriteria.description){
      conditions.firstName = { $regex: new RegExp(`^${searchCriteria.description}`), $options: 'i' };
        
    }

    if(searchCriteria.applicationName){
      conditions.lastName = { $regex: new RegExp(`^${searchCriteria.applicationName}`), $options: 'i' };        
    }

    const requirePagination = searchCriteria.pageNumber && searchCriteria.pageSize

    const aggregateSearchResults = await PermissionSchemaModel.aggregate([
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
                { $skip: (searchCriteria.pageNumber! - 1) * searchCriteria.pageSize! },
                { $limit: searchCriteria.pageSize! }
              ] 
              : [])
          ]
        }
      }
    ])

    const totalCount = aggregateSearchResults[0].counter[0].totalCount

    const pageSize = requirePagination ? searchCriteria.pageSize : totalCount;
		const currentPageNumber = requirePagination ? searchCriteria.pageNumber : 1;

    const result: PaginationResults<Permission> = {
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount/pageSize),
      pageSize: pageSize!,
      pageNumber: currentPageNumber!,
      records: aggregateSearchResults[0].paginatedResults
    }

    return result
}