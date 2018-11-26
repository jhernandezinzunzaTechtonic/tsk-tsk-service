const queryString = require('querystring');

export function buildMongoQuery(query, user)
{
  let { searchQueryString, page, limit } = query; // Define variables to be used from the query
  let parsedQuery = queryString.parse(searchQueryString); // Parse the query string to use use its values
  console.log(searchQueryString);
  let mongoQuery = {}; // Start with basic query object to be filled as conditions are met.
  mongoQuery.page = parseInt(page);
  mongoQuery.limit = parseInt(limit);
  mongoQuery.skip = (mongoQuery.page * mongoQuery.limit) - mongoQuery.limit;

  if (parsedQuery.title === '' && parsedQuery.author === '') { // Empty query string given, search for all.
    console.log('No queries, returning all');
    mongoQuery.query = { userID: user };
    return mongoQuery;
  } else if (parsedQuery.title && parsedQuery.author) {  // Both title and author exist, perform $and query
    console.log('Both title and author defined, running custom search');
    mongoQuery.query = {};
    mongoQuery.query.$and =
    [{ userID: user },
    { title: { $regex: parsedQuery.title, $options: '$i' } },
    { author: { $regex: parsedQuery.author, $options: '$i' } }];
    console.log(mongoQuery.query);
    return mongoQuery;
  } else if (parsedQuery.author && parsedQuery.title === '') { // Only author exist, perform author query
    console.log('Only author defined, running author search');
    mongoQuery.query = {};
    mongoQuery.query.$and =
    [{ userID: user },
    { author: { $regex: parsedQuery.author, $options: '$i' } }];
    return mongoQuery;
  } else if (parsedQuery.title && parsedQuery.author === '') { // Only title exist, perform title query
    console.log('Only title defined, running title search');
    mongoQuery.query = {};
    mongoQuery.query.$and =
    [{ userID: user },
    { title: { $regex: parsedQuery.title, $options: '$i' } }];
    return mongoQuery;
  }
}
