import { AuthToken } from '../../../../core/models/AuthToken';
import { Base64 } from 'js-base64';
import { UserRole } from '../../../../core/models/UserRole';
import { assert } from 'chai';
import { authTokenRepo } from '../../../../shell/repositories/AuthTokenRepoImpl';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { storageKeys } from '../../../../core/models/Storage';

describe('AuthTokenRepoImpl unit', function () {
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
        await authTokenRepo.getToken(),
        'null string is considered empty'
      );
    });

    it('should return the token successfully', async function () {
      await kvStorage.setItem(storageKeys.authToken, 'a token');

      assert.equal(await authTokenRepo.getToken(), 'a token');
    });
  });

  describe('saveToken', function () {
    it('should save the token successfully', async function () {
      await authTokenRepo.saveToken('a token');

      assert.equal(await kvStorage.getItem(storageKeys.authToken), 'a token');
    });
  });

  describe('clearToken', function () {
    it('should clear the token successfully', async function () {
      await kvStorage.setItem(storageKeys.authToken, 'a token');

      await authTokenRepo.clearToken();

      assert.isUndefined(await kvStorage.getItem(storageKeys.authToken));
    });
  });

  describe('getParsedToken', async function () {
    it('should return expired token if the given token was an empty string', async function () {
      await authTokenRepo.saveToken('');
      const payload = await authTokenRepo.getParsedToken();

      assert.deepEqual(payload, new AuthToken());
    });

    it('should return the parsed payload', async function () {
      await authTokenRepo.saveToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      );

      assert.deepEqual(
        await authTokenRepo.getParsedToken(),
        new AuthToken({
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

      await authTokenRepo.saveToken(nonExpiredToken);

      assert.isTrue(
        (await authTokenRepo.getParsedToken()).isNotExpired(),
        'true when not expired'
      );
      assert.isFalse((await authTokenRepo.getParsedToken()).isExpired());
    });
    it('should be expired if the token expiry epoch (in seconds) is less than the current epoch', async function () {
      const expiredToken = encodeFakeToken({
        exp: Date.now() / 1000 - 3600,
      });

      await authTokenRepo.saveToken(expiredToken);

      assert.isFalse(
        (await authTokenRepo.getParsedToken()).isNotExpired(),
        'true when not expired'
      );
      assert.isTrue((await authTokenRepo.getParsedToken()).isExpired());
    });
    it('should return the roles if they exist in the token', async function () {
      const tokenWithRoles = encodeFakeToken({
        roles: ['opsUser', 'root'],
      });

      await authTokenRepo.saveToken(tokenWithRoles);

      assert.deepEqual((await authTokenRepo.getParsedToken()).roles, [
        'opsUser',
        'root',
      ]);
    });

    it('should return an empty array if no roles property existed', async function () {
      const tokenWithoutRoles = encodeFakeToken({
        noRoles: ['opsUser', 'root'],
      });
      await authTokenRepo.saveToken(tokenWithoutRoles);

      const extractedRoles = (await authTokenRepo.getParsedToken()).roles;

      assert.isArray(extractedRoles);
      assert.isEmpty(extractedRoles);
    });
  });

  describe('getUserId', function () {
    it('should return the subject of the token parsed as number', async function () {
      const tokenWithoutRoles = encodeFakeToken({
        sub: '12345',
        noRoles: ['opsUser', 'root'],
      });

      await authTokenRepo.saveToken(tokenWithoutRoles);

      assert.equal(await authTokenRepo.getUserId(), 12345);
    });
  });

  describe('getUserRoles', function () {
    it('should return the user roles', async function () {
      const tokenWithRoles = encodeFakeToken({
        roles: ['OpsUser', 'CustomerService'],
      });

      await authTokenRepo.saveToken(tokenWithRoles);

      assert.deepEqual(await authTokenRepo.getUserRoles(), [
        UserRole.OPS_USER,
        UserRole.CS_USER,
      ]);
    });
  });
});
