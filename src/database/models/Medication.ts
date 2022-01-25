import { Schema, Types, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export const DOCUMENT_NAME = "Medication";
export const COLLECTION_NAME = "medications";

export default interface Medication {
  name: string;
  weight: number;
  code: string;
  image: string;
}

const schema = new Schema<Medication>({
  name: {
    type: Schema.Types.String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9_-]*$/g.test(v);
      },
      message: 'Only upper case letters, underscore and numbers are allowed'
    },
    required: true
  },
  weight: {
    type: Schema.Types.Number,
    required: true
  },
  code: {
    type: Schema.Types.String,
    required: true,
  },
  image: {
    type: Schema.Types.String
  }
});

export const MedicationModel = model<Medication>(DOCUMENT_NAME, schema, COLLECTION_NAME)