import { assert } from 'chai';
import {
  createUrl,
  parseRequestLine,
  reduceUrlParams,
  reduceUrlQuery,
} from '../../../../core/utils/url';

describe('url utils module', function () {
  describe('parseRequestLine', function () {
    it('should extract the method and the url', function () {
      assert.deepEqual(parseRequestLine('get http://example.com'), {
        method: 'get',
        url: 'http://example.com',
      });
    });

    it('should trim and ignore multiple spaces between url and method', function () {
      assert.deepEqual(parseRequestLine('    get      http://example.com   '), {
        method: 'get',
        url: 'http://example.com',
      });
    });
  });

  describe('reduceUrlParams', function () {
    it('should replace only url parameters starting with "/:"', function () {
      const url = reduceUrlParams(
        'http://username:password@domain.com:port/directory:name/:id/:name',
        {
          id: 1234,
          name: 'testing',
          password: 'p',
          port: 8080,
        }
      );

      assert.equal(
        url,
        'http://username:password@domain.com:port/directory:name/1234/testing'
      );
    });
    it('should return the URL if given non-object params', function () {
      const url = reduceUrlParams(
        'http://username:password@domain.com:port/directory:name/:id/:name',
        null
      );

      assert.equal(
        url,
        'http://username:password@domain.com:port/directory:name/:id/:name'
      );
    });
  });

  describe('reduceUrlQuery', function () {
    context('when given non-object query', function () {
      it('should return the URL as is', function () {
        assert.equal(
          reduceUrlQuery('http://example.com', null),
          'http://example.com'
        );
      });
    });

    context('when given an empty query object', function () {
      it('should return the URL as is', function () {
        assert.equal(
          reduceUrlQuery('http://example.com', {}),
          'http://example.com'
        );
      });
    });

    context(
      'when given primitive, and non-empty query properties',
      function () {
        it('should add the values as is', function () {
          const url = reduceUrlQuery('http://example.com', {
            a: 'query',
            b: 'query',
          });

          assert.equal(url, 'http://example.com?a=query&b=query');
        });
      }
    );
    context('when given primitive, and empty query properties', function () {
      it('should ignore them', function () {
        const url = reduceUrlQuery('http://example.com', {
          a: '1',
          b: '',
        });

        assert.equal(url, 'http://example.com?a=1');
      });
    });

    context(
      'when given non-primitive, and non-empty query properties',
      function () {
        it('should stringify non primitives and encode them with url encoding', function () {
          const query = {
            a: 'query',
            b: {
              c: 'query',
            },
          };
          const url = reduceUrlQuery('http://example.com', query);

          assert.equal(
            url,
            'http://example.com?a=query&b=%7B%22c%22%3A%22query%22%7D'
          );
        });
      }
    );
    context(
      'when given non-primitive, and empty query properties',
      function () {
        it('should ignore them', function () {
          const query = {
            a: 'query',
            b: {},
          };
          const url = reduceUrlQuery('http://example.com', query);

          assert.equal(url, 'http://example.com?a=query');
        });
      }
    );

    it('should produce the same result regardless of the object properties order', function () {
      const url1 = reduceUrlQuery('example.com', {
        b: {
          d: 'query',
          c: 'query',
        },
        a: 'query',
      });

      const url2 = reduceUrlQuery('example.com', {
        a: 'query',
        b: {
          c: 'query',
          d: 'query',
        },
      });

      assert.equal(url1, url2);
    });
  });

  describe('createUrl', function () {
    context('when given a non-object params', function () {
      it('should return the url as is', function () {
        assert.equal(
          createUrl({ url: 'example.com', params: null }),
          'example.com'
        );
      });
    });

    context('when given an empty params object', function () {
      it('should return the url as is', function () {
        assert.equal(
          createUrl({ url: 'example.com', params: {} }),
          'example.com'
        );
      });
    });
    context('when given an non-empty params object', function () {
      it('should add the params successfully', function () {
        assert.equal(
          createUrl({ url: 'example.com/:userId', params: { userId: 123 } }),
          'example.com/123'
        );
      });
    });

    context('when given a non-object query', function () {
      it('should return the url as is', function () {
        assert.equal(
          createUrl({ url: 'example.com', query: null }),
          'example.com'
        );
      });
    });
    context('when given an empty params query', function () {
      it('should return the url as is', function () {
        assert.equal(
          createUrl({ url: 'example.com', query: null }),
          'example.com'
        );
      });
    });
    context('when given an non-empty params query', function () {
      it('should add the query successfully', function () {
        assert.equal(
          createUrl({
            url: 'example.com',
            query: {
              a: 'hi',
              b: 'bye',
            },
          }),
          'example.com?a=hi&b=bye'
        );
      });
    });

    context('when given non-empty params and query objects', function () {
      it('should add the params and query successfully', function () {
        assert.equal(
          createUrl({
            url: 'example.com/:userId',
            params: {
              userId: 1234,
            },
            query: {
              a: 'hi',
              b: 'bye',
            },
          }),
          'example.com/1234?a=hi&b=bye'
        );
      });
    });
  });
});
