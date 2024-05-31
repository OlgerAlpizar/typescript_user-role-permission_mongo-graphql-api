import { Document, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export default interface Permission extends Document {
    name: string
    description: string
    applicationName: string
}

const PermissionSchema = new Schema<Permission>(
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
      applicationName: {
        type: String,
        index: true,
        required: true,
      }
    },
    {
      timestamps: true, //auto createdAt and updatedAt columns
    }
  ).plugin(uniqueValidator)
  
  export const PermissionSchemaModel = model<Permission>('Permission', PermissionSchema)