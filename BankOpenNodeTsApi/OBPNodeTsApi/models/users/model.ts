import mongoose = require('mongoose');

export interface userdef extends mongoose.Document {
    short_name: string;
    name: string;
    can_add_bank?: boolean;
    can_add_users?: boolean;
    can_edit_banks?: boolean;
    can_edit_users?: boolean;
    providers?: [
        {
            auth_provider_name: string;
            auth_id: string;
        }
    ];
    bank_permissions?: [
        {
            bank_id: any;
            customer_id?: any;
            can_edit_branches?: boolean;
            can_edit_atms?: boolean;
            can_edit_products?: boolean;
            can_edit_customers?: boolean;
            can_see_all_accounts?: boolean;
            can_add_all_accounts?: boolean;
            can_edit_all_accounts?: boolean;
            can_see_all_transactions_for_banks?: boolean;
            can_add_all_transactions_for_banks?: boolean;
            can_edit_all_transactions_for_banks?: boolean;
        }
    ];
}

export class user {
    _schema: mongoose.Schema = new mongoose.Schema({
        short_name: {
            type: String, required: true, trim: true
        },
        display_name: {
            type: String, required: true, trim: true
        },
        can_add_bank: {
            type: Boolean, default: false
        },
        can_add_users: {
            type: Boolean, default: false
        },
        can_edit_banks: {
            type: Boolean, default: false
        },
        can_edit_users: {
            type: Boolean, default: false
        },
        providers: [
            {

                auth_provider_name: {
                    type: String, required: true, trim: true
                },
                auth_id: {
                    type: String, required: true, trim: true
                }

            }
        ],
        bank_permissions: [
            {
                bank_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'bank' },
                customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
                can_edit_branches: {
                    type: Boolean
                },
                can_edit_atms: {
                    type: Boolean
                },
                can_edit_products: {
                    type: Boolean
                },
                can_edit_customers: {
                    type: Boolean
                },
                can_see_all_accounts: {
                    type: Boolean
                },
                can_add_all_accounts: {
                    type: Boolean
                },
                can_edit_all_accounts: {
                    type: Boolean
                },
                can_see_all_transactions_for_banks: {
                    type: Boolean
                },
                can_add_all_transactions_for_banks: {
                    type: Boolean
                },
                can_edit_all_transactions_for_banks: {
                    type: Boolean
                }
            }
        ]
    },
        { timestamps: true }
    )
        .index({ 'providers.auth_provider_name': 1, 'providers.auth_id': -1 }, { unique: true })
        .pre('save', function (next) {
            //this.updated = new Date();
            next();
        });
    current: mongoose.Model<userdef>;
    constructor() {
        this.current = mongoose.model<userdef>('user', this._schema);
    }
    set(item: userdef) {
        return new this.current(item);
    }
}
