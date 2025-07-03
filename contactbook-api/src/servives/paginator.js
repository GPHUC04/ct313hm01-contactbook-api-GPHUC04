class Paginator {
  constructor(page = 1, limit = 5) {
    // Validate and set limit
    this.limit = parseInt(limit, 10);
    if (isNaN(this.limit) || this.limit < 1) {
      this.limit = 5;
    }

    // Validate and set page
    this.page = parseInt(page, 10);
    if (isNaN(this.page) || this.page < 1) {
      // Fixed: check this.page instead of this.limit
      this.page = 1;
    }

    this.offset = (this.page - 1) * this.limit;
  }

  getMetadata(totalRecords) {
    if (totalRecords === 0) {
      return {
        totalRecords: 0,
        totalPages: 0,
        currentPage: this.page,
        limit: this.limit,
        hasNext: false,
        hasPrev: false,
      };
    }

    const totalPages = Math.ceil(totalRecords / this.limit);
    const hasNext = this.page < totalPages;
    const hasPrev = this.page > 1;

    return {
      totalRecords,
      totalPages,
      currentPage: this.page,
      firstPage: 1, // Fixed: define firstPage
      lastPage: totalPages,
      limit: this.limit,
      hasNext,
      hasPrev,
    };
  }
}

module.exports = Paginator;
