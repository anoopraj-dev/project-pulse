const paginate = async ({
    model,
    query={},
    page=1,
    limit=10,
    sort={createdAt:-1},
    populate=null,
})=>{
    page = Math.max(1,parseInt(page));
    limit = Math.max(1,parseInt(limit));

    const skip = (page -1)*limit;

    let dbQuery = model.find(query).sort(sort).skip(skip).limit(limit);

    if(populate){
        dbQuery= dbQuery.populate(populate)
    }

    const [data,total] = await Promise.all([
        dbQuery,
        model.countDocuments(query)
    ]);

    return {
        data,
        pagination:{
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    }
}

export default paginate