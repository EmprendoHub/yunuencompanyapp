import { Query } from "mongoose";

class APIPaymentsFilters {
  private query: Query<any, any>; // Mongoose Query type
  private queryStr: URLSearchParams; // URLSearchParams type

  constructor(query: Query<any, any>, queryStr: URLSearchParams) {
    this.query = query;
    this.queryStr = queryStr;
  }

  searchAllFields(): this {
    const branch = this.queryStr.get("branch");
    const method = this.queryStr.get("paid");

    const searchConditions: Record<string, any> = {};

    if (method) {
      searchConditions["method"] = { $eq: method };
    }

    if (branch) {
      searchConditions["user"] = { $eq: branch };
    }

    // If both filters are provided, both will be included in the searchConditions
    // without overriding each other
    if (Object.keys(searchConditions).length) {
      this.query = this.query.find({
        ...this.query.getQuery(),
        ...searchConditions,
      });
    }

    return this;
  }

  filter(): this {
    const queryCopy: Record<string, string> = {};
    this.queryStr.forEach((value, key) => {
      queryCopy[key] = value;
    });

    const removeFields = [
      "type",
      "user",
      "paid",
      "branch",
      "method",
      "page",
      "per_page",
    ];
    removeFields.forEach((el) => delete queryCopy[el]);

    const output: Record<string, any> = {};
    for (const key in queryCopy) {
      if (key.match(/\b(gt|gte|lt|lte)\b/)) {
        const prop = key.split("[")[0]; // Extract field name (e.g., 'createdAt')
        const operator = key.match(/\[(.*)\]/)?.[1]; // Extract operator (e.g., 'gte')
        if (operator) {
          if (!output[prop]) {
            output[prop] = {};
          }
          // Convert the date string to a Date object for MongoDB
          output[prop][`$${operator}`] = new Date(queryCopy[key]);
        }
      } else {
        output[key] = queryCopy[key];
      }
    }
    const today = new Date();

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
      0,
      0,
      0,
      0
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0,
      0
    );

    const defaultOutput = {
      pay_date: {
        $lte: endOfToday,
        $gte: startOfToday,
      },
    };

    const selectedDate = {
      pay_date: {
        $lte: output.createdAt["$lte"],
        $gte: output.createdAt["$gte"],
      },
    };

    this.query = this.query.find(
      output.createdAt ? selectedDate : defaultOutput
    );

    return this;
  }
}

export default APIPaymentsFilters;
