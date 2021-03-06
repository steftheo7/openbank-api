﻿import mongoose = require('mongoose');
import common = require("../commoninterfaces")

export interface customerdef extends mongoose.Document {
    legal_name: string;
    mobile_phone_number?: string;
    email?: string;
    faceImage?: CustomerFaceImage;
    crm?: any;
    string_values?: any;
    date_values?: any;
    numeric_values?: any;
    accounts?: any;
    meta?: any;
    bank_id?: any;
    islocked?: any;
}
export interface CustomerFaceImage {
    url: string;
    date?: any;
}

export class customer {
    _schema: mongoose.Schema = new mongoose.Schema({
        legal_name: {
            type: String, required: true, trim: true, index: { unique: false }
        },
        mobile_phone_number: {
            type: String, trim: true
        },
        email: {
            type: String, trim: true, match: common.mail
        },
        faceImage: mongoose.Schema.Types.Mixed,
        crm: mongoose.Schema.Types.Mixed,
        string_values: [
            {
                key: { type: String, trim: true },
                string: { type: String, trim: true }
            }
        ],
        date_values: [
            {
                key: { type: String, trim: true },
                string: { type: Date, trim: true }
            }
        ],
        numeric_values: [
            {
                key: { type: String, trim: true },
                string: { type: Number }
            }
        ],
        accounts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'account' }], select: false },
        meta: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'metadata' }], select: false },
        bank_id: { type: mongoose.Schema.Types.ObjectId, ref: 'bank', select: false },
        islocked: {
            type: Boolean, select: false
        }
    },
        { timestamps: true }
    )
        .pre('save', function (next) {
            //this.updated = new Date();
            next();
        });
    current: mongoose.Model<customerdef>;
    constructor() {
        this.current = mongoose.model<customerdef>('customer', this._schema);
    }
    set(item: customerdef) {
        return new this.current(item);
    }
}
