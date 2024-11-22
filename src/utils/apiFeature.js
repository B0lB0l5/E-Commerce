export class ApiFeature {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData
    }

    pagination() {
        let { page, size } = this.queryData
        if( !page || page <= 0) page = 1
        if( !size || size <= 0) size = 2
        const skip = (page - 1) * size 
        this.mongooseQuery.limit(size).skip(skip)
        return this
    }

    sort() {
        let { sort } = this.queryData
        sort = sort?.replaceAll(',', ' ')
        this.mongooseQuery.sort(sort)
        return this
    }

    select() {
        let { select } = this.queryData
        select = select?.replaceAll(',', ' ')
        this.mongooseQuery.select(select)
        return this
    }

    filter(){
        let { page, size, sort, select, ...filter } = this.queryData
        filter = JSON.parse(JSON.stringify(filter).replace(/'gte|gt|lte|lt'/g, match => `$${match}`))
        this.mongooseQuery.find(filter)
        return this
    }
}