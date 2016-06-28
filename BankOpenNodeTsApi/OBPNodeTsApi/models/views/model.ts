import mongoose = require('mongoose');

export interface viewdef extends mongoose.Document {
    user_id?: any;
    bank_id?: any;
    short_name?: string;
    description?: string;

    // true if the public (user not logged in) can see this view
    is_public?: boolean;

    //"public/private/none"
    which_alias_to_use: string;

    hide_metadata_if_alias_used?: boolean;
    can_see_transaction_this_bank_account?: boolean;
    can_see_transaction_other_bank_account?: boolean;
    can_see_transaction_metadata?: boolean;
    can_see_transaction_label?: boolean;
    can_see_transaction_amount?: boolean;
    can_see_transaction_type?: boolean;
    can_see_transaction_currency?: boolean;
    can_see_transaction_start_date?: boolean;
    can_see_transaction_finish_date?: boolean;
    can_see_transaction_balance?: boolean;
    can_see_comments?: boolean;
    can_see_narrative?: boolean;
    can_see_tags?: boolean;
    can_see_images?: boolean;
    can_see_bank_account_owners?: boolean;
    can_see_bank_account_type?: boolean;
    can_see_bank_account_balance?: boolean;
    can_see_bank_account_currency?: boolean;
    can_see_bank_account_label?: boolean;
    can_see_bank_account_national_identifier?: boolean;
    can_see_bank_account_swift_bic?: boolean;
    can_see_bank_account_iban?: boolean;
    can_see_bank_account_number?: boolean;
    can_see_bank_account_bank_name?: boolean;
    can_see_other_account_national_identifier?: boolean;
    can_see_other_account_swift_bic?: boolean;
    can_see_other_account_iban?: boolean;
    can_see_other_account_bank_name?: boolean;
    can_see_other_account_number?: boolean;
    can_see_other_account_metadata?: boolean;
    can_see_other_account_kind?: boolean;
    can_see_more_info?: boolean;
    can_see_url?: boolean;
    can_see_image_url?: boolean;
    can_see_open_corporates_url?: boolean;
    can_see_corporate_location?: boolean;
    can_see_physical_location?: boolean;
    can_see_public_alias?: boolean;
    can_see_private_alias?: boolean;
    can_add_more_info?: boolean;
    can_add_url?: boolean;
    can_add_image_url?: boolean;
    can_add_open_corporates_url?: boolean;
    can_add_corporate_location?: boolean;
    can_add_physical_location?: boolean;
    can_add_public_alias?: boolean;
    can_add_private_alias?: boolean;
    can_delete_corporate_location?: boolean;
    can_delete_physical_location?: boolean;
    can_edit_narrative?: boolean;
    can_add_comment?: boolean;
    can_delete_comment?: boolean;
    can_add_tag?: boolean;
    can_delete_tag?: boolean;
    can_add_image?: boolean;
    can_delete_image?: boolean;
    can_add_where_tag?: boolean;
    can_see_where_tag?: boolean;
    can_delete_where_tag?: boolean;
    can_initiate_transaction?: boolean;
    can_approve_transaction?: boolean;
    can_cancel_transaction?: boolean;
    can_pause_transaction?: boolean;
}

export class view {
    _schema: mongoose.Schema = new mongoose.Schema({
        user_id: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], select: false },
        bank_id: { type: mongoose.Schema.Types.ObjectId, ref: 'bank', select: false },
        name: { type: String, trim: true },
        description: { type: String, trim: true },
        is_public: { type: Boolean, default: false },
        which_alias_to_use: { type: String, trim: true, require: true, enum: ['public', 'private', 'none'] },
        hide_metadata_if_alias_used: { type: Boolean, default: false },
        can_see_transaction_this_bank_account: { type: Boolean, default: false },
        can_see_transaction_other_bank_account: { type: Boolean, default: false },
        can_see_transaction_metadata: { type: Boolean, default: false },
        can_see_transaction_description: { type: Boolean, default: false },
        can_see_transaction_amount: { type: Boolean, default: false },
        can_see_transaction_type: { type: Boolean, default: false },
        can_see_transaction_currency: { type: Boolean, default: false },
        can_see_transaction_start_date: { type: Boolean, default: false },
        can_see_transaction_finish_date: { type: Boolean, default: false },
        can_see_transaction_balance: { type: Boolean, default: false },
        can_see_comments: { type: Boolean, default: false },
        can_see_narrative: { type: Boolean, default: false },
        can_see_tags: { type: Boolean, default: false },
        can_see_images: { type: Boolean, default: false },
        can_see_bank_account_owners: { type: Boolean, default: false },
        can_see_bank_account_type: { type: Boolean, default: false },
        can_see_bank_account_balance: { type: Boolean, default: false },
        can_see_bank_account_currency: { type: Boolean, default: false },
        can_see_bank_account_label: { type: Boolean, default: false },
        can_see_bank_account_national_identifier: { type: Boolean, default: false },
        can_see_bank_account_swift_bic: { type: Boolean, default: false },
        can_see_bank_account_iban: { type: Boolean, default: false },
        can_see_bank_account_number: { type: Boolean, default: false },
        can_see_bank_account_bank_name: { type: Boolean, default: false },
        can_see_other_account_national_identifier: { type: Boolean, default: false },
        can_see_other_account_swift_bic: { type: Boolean, default: false },
        can_see_other_account_iban: { type: Boolean, default: false },
        can_see_other_account_bank_name: { type: Boolean, default: false },
        can_see_other_account_number: { type: Boolean, default: false },
        can_see_other_account_metadata: { type: Boolean, default: false },
        can_see_other_account_kind: { type: Boolean, default: false },
        can_see_more_info: { type: Boolean, default: false },
        can_see_url: { type: Boolean, default: false },
        can_see_image_url: { type: Boolean, default: false },
        can_see_open_corporates_url: { type: Boolean, default: false },
        can_see_corporate_location: { type: Boolean, default: false },
        can_see_physical_location: { type: Boolean, default: false },
        can_see_public_alias: { type: Boolean, default: false },
        can_see_private_alias: { type: Boolean, default: false },
        can_add_more_info: { type: Boolean, default: false },
        can_add_url: { type: Boolean, default: false },
        can_add_image_url: { type: Boolean, default: false },
        can_add_open_corporates_url: { type: Boolean, default: false },
        can_add_corporate_location: { type: Boolean, default: false },
        can_add_physical_location: { type: Boolean, default: false },
        can_add_public_alias: { type: Boolean, default: false },
        can_add_private_alias: { type: Boolean, default: false },
        can_delete_corporate_location: { type: Boolean, default: false },
        can_delete_physical_location: { type: Boolean, default: false },
        can_edit_narrative: { type: Boolean, default: false },
        can_add_comment: { type: Boolean, default: false },
        can_delete_comment: { type: Boolean, default: false },
        can_add_tag: { type: Boolean, default: false },
        can_delete_tag: { type: Boolean, default: false },
        can_add_image: { type: Boolean, default: false },
        can_delete_image: { type: Boolean, default: false },
        can_add_where_tag: { type: Boolean, default: false },
        can_see_where_tag: { type: Boolean, default: false },
        can_delete_where_tag: { type: Boolean, default: false },
        can_initiate_transaction: { type: Boolean, default: false },
        can_approve_transaction: { type: Boolean, default: false },
        can_cancel_transaction: { type: Boolean, default: false },
        can_pause_transaction: { type: Boolean, default: false }
    }, 
    { timestamps: true}
    )
        .pre('save', function (next) {
            //this.updated = new Date();
            next();
        })
    ;
    current: mongoose.Model<viewdef>;
    constructor() {
        this.current = mongoose.model<viewdef>('view', this._schema);
    }
    set(item: viewdef) {
        return new this.current(item);
    }
    empty() {
        var item: viewdef = null;
        // {



        //    }
        return new this.current(item);
    }
}
