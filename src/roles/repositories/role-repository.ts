import Role, { RoleSchemaModel } from '../models/role'
import SearchRole from '../models/search-role'
import {PaginationResults} from '../../commons/models/pagination-results'
import { FilterQuery } from 'mongoose'

export const create = async (newRole: Role): Promise<Role> => {
    const exists = await RoleSchemaModel.findOne({ name: newRole.name,  domain: newRole.domain })
  
    if (exists) {
      throw new Error(`Role ${newRole.name} already exists`)
    }

    const Role = new RoleSchemaModel(newRole)

    return await Role.save().then((res) => {
        return res
      })
}

export const update = async (updatingRole: Role): Promise<void> => {
    const updatedRole = await RoleSchemaModel.findByIdAndUpdate(updatingRole.id, updatingRole)
  
    if (!updatedRole) {
      throw new Error(`Role ${updatingRole.name} does not exist`)
    }
}

export const remove = async (removingRoleId: String): Promise<void> => {
    const removedRole = await RoleSchemaModel.findByIdAndDelete(removingRoleId)
  
    if (!removedRole) {
      throw new Error(`Role ${removingRoleId} does not exist`)
    }
}

export const getSingle = async (gettingRoleId: String): Promise<Role> => {
    const existingRole = await RoleSchemaModel.findById(gettingRoleId)
  
    if (!existingRole) {
      throw new Error(`Role ${gettingRoleId} does not exist`)
    }

    return existingRole
}

export const search = async (searchCriteria: SearchRole): Promise<PaginationResults<Role>> => {

    const conditions: FilterQuery<Role> = {}

    if(searchCriteria.name){
      conditions.email = { $regex: new RegExp(`^${searchCriteria.name}`), $options: 'i' };
    }

    if(searchCriteria.description){
      conditions.firstName = { $regex: new RegExp(`^${searchCriteria.description}`), $options: 'i' };
        
    }

    if(searchCriteria.domain){
      conditions.lastName = { $regex: new RegExp(`^${searchCriteria.domain}`), $options: 'i' };        
    }

    const requirePagination = searchCriteria.pageNumber && searchCriteria.pageSize

    const aggregateSearchResults = await RoleSchemaModel.aggregate([
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

    const result: PaginationResults<Role> = {
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount/pageSize),
      pageSize: pageSize!,
      pageNumber: currentPageNumber!,
      records: aggregateSearchResults[0].paginatedResults
    }

    return result
}