import { NextFunction, Request, Response } from 'express';
import { inHTMLData } from 'xss-filters';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

/**
 * Clean for xss.
 * @param {string|object} data - The value to sanitize
 * @return {string|object} The sanitized value
 */
export const clean = <T>(data: T | string = ''): T | string => {
  if (typeof data === 'object') {
    const jsonString = JSON.stringify(data);
    const sanitizedJsonString = inHTMLData(jsonString).trim();
    return JSON.parse(sanitizedJsonString) as T;
  } else if (typeof data === 'string') {
    return inHTMLData(data).trim();
  } else {
    return data;
  }
};

const xss = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = clean(req.body);
    
    if (req.query) {
      req.query = clean<ParsedQs>(req.query) as ParsedQs;
    }

    if (req.params) {
      req.params = clean<ParamsDictionary>(req.params) as ParamsDictionary;
    }

    next();
  };
};

export default xss;
