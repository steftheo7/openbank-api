export function update(insert, model, deferred) {
    insert.validate(function (err) {
        if (err) {
            deferred.resolve({ error: err, status: 400 });
            return;
        }
        model.findByIdAndUpdate(insert._id, insert, { upsert: true, new: true },
            function (err2, found) {
                if (err2) deferred.resolve({ error: err2, status: 400 });
                else {
                    found = transform(found._doc);
                    deferred.resolve({ data: found, status: 201 })
                }
            });
    });
    return;
}
export function transform(schema) {
    function change(ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
    }
    if (schema) {
        if (schema.constructor === Object) { change(schema); }
        else { schema.map(function (ret) { change(ret); }); }
    }
    return schema;
}
export function answer(params: Object) {
    var err = params['err'], found = params['found'], name = params['name'], deferred = params['deferred'];
    if (err) {
        if (err.kind == "ObjectId") { deferred.resolve({ error: 'ID with value ' + err.value + ' is Not Valid', status: 400 }); }
        deferred.resolve({ error: err, status: 500 });
    }
    else if (!found || (found['length'] == 0)) {
        deferred.resolve({ error: name + " not exists", status: 404 })
    }
    else {
        deferred.resolve({ data: found, status: 200 })
    }
    return
}