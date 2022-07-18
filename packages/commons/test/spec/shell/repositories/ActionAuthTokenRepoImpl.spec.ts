import { ActionAuthToken } from '../../../../core/models/ActionAuthToken';
import { Base64 } from 'js-base64';
import { actionAuthTokenRepo } from '../../../../shell/repositories/ActionAuthTokenRepoImpl';
import { assert } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { storageKeys } from '../../../../core/models/Storage';

describe('ActionAuthTokenRepoImpl unit', function () {
  function encodeFakeToken(object: unknown) {
    const header = Base64.encode(
      JSON.stringify({
        alg: 'HS256',
        typ: 'JWT',
      })
    );

    const payload = Base64.encode(JSON.stringify(object));

    const signature = Base64.encode('5395ebfd174b0a5617e6f409dfbb3e064e3fdf0a');

    return `${header}.${payload}.${signature}`;
  }

  describe('getToken', function () {
    it('should return undefined if the string was empty', async function () {
      assert.isUndefined(
        await actionAuthTokenRepo.getToken(),
        'null string is considered empty'
      );
    });

    it('should return the token successfully', async function () {
      await kvStorage.setItem(storageKeys.actionAuthToken, 'a token');

      assert.equal(await actionAuthTokenRepo.getToken(), 'a token');
    });
  });

  describe('saveToken', function () {
    it('should save the token successfully', async function () {
      await actionAuthTokenRepo.saveToken('a token');

      assert.equal(
        await kvStorage.getItem(storageKeys.actionAuthToken),
        'a token'
      );
    });
  });

  describe('clearToken', function () {
    it('should clear the token successfully', async function () {
      await kvStorage.setItem(storageKeys.actionAuthToken, 'a token');

      await actionAuthTokenRepo.clearToken();

      assert.isUndefined(await kvStorage.getItem(storageKeys.actionAuthToken));
    });
  });

  describe('getParsedToken', async function () {
    it('should return expired token if the given token was an empty string', async function () {
      await actionAuthTokenRepo.saveToken('');
      const payload = await actionAuthTokenRepo.getParsedToken();

      assert.deepEqual(payload, new ActionAuthToken());
    });

    it('should return the parsed payload', async function () {
      await actionAuthTokenRepo.saveToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      );

      assert.deepEqual(
        await actionAuthTokenRepo.getParsedToken(),
        new ActionAuthToken({
          sub: '1234567890',
          name: 'John Doe',
          iat: 1516239022,
          exp: 0,
          roles: [],
          iss: '',
        })
      );
    });
    it('should not be expired if the token expiry epoch (in seconds) is greater than the current epoch', async function () {
      const nonExpiredToken = encodeFakeToken({
        exp: Date.now() / 1000 + 3600,
      });

      await actionAuthTokenRepo.saveToken(nonExpiredToken);

      assert.isTrue(
        (await actionAuthTokenRepo.getParsedToken()).isNotExpired(),
        'true when not expired'
      );
      assert.isFalse((await actionAuthTokenRepo.getParsedToken()).isExpired());
    });
    it('should be expired if the token expiry epoch (in seconds) is less than the current epoch', async function () {
      const expiredToken = encodeFakeToken({
        exp: Date.now() / 1000 - 3600,
      });

      await actionAuthTokenRepo.saveToken(expiredToken);

      assert.isFalse(
        (await actionAuthTokenRepo.getParsedToken()).isNotExpired(),
        'true when not expired'
      );
      assert.isTrue((await actionAuthTokenRepo.getParsedToken()).isExpired());
    });
    it('should return the roles if they exist in the token', async function () {
      const tokenWithRoles = encodeFakeToken({
        roles: ['opsUser', 'root'],
      });

      await actionAuthTokenRepo.saveToken(tokenWithRoles);

      assert.deepEqual((await actionAuthTokenRepo.getParsedToken()).roles, [
        'opsUser',
        'root',
      ]);
    });

    it('should return an empty array if no roles property existed', async function () {
      const tokenWithoutRoles = encodeFakeToken({
        noRoles: ['opsUser', 'root'],
      });
      await actionAuthTokenRepo.saveToken(tokenWithoutRoles);

      const extractedRoles = (await actionAuthTokenRepo.getParsedToken()).roles;

      assert.isArray(extractedRoles);
      assert.isEmpty(extractedRoles);
    });
  });
});
