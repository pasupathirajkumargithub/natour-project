class APIFeatures {
  constructor(query, queryStr) {
    console.log(queryStr);
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const queryObj = { ...this.queryStr };
    const excludedField = ['page', 'sort', 'limit', 'fields'];
    excludedField.forEach((el) => delete queryObj[el]);

    //advanced search

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt| lte|lt)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(queryStr));
    // this.query = this.query.find(queryStr);

    // Tour.find().find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  fields() {
    if (this.queryStr.fields) {
      this.query = this.query.select(this.queryStr.fields.split(',').join(' '));
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagenation() {
    const page = this.queryStr.page * 1 || 1;

    const limit = this.queryStr.limit * 1 || 100;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
