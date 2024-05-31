import { Document, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export default interface Role extends Document {
    name: string
    description: string
    domain: string
    permissionIds: string[]
}

const RoleSchema = new Schema<Role>(
    {
      name: {
        type: String,
        index: true,
        required: true,
      },
      description: {
        type: String,
        index: true,
        required: true,
      },
      domain: {
        type: String,
        index: true,
        required: true,
      },
      permissionIds: {
        type: [String],
        index: true,
        required: true,
      },
    },
    {
      timestamps: true, //auto createdAt and updatedAt columns
    }
  ).plugin(uniqueValidator)
  
  export const RoleSchemaModel = model<Role>('Role', RoleSchema)