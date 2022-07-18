import { Datetime } from '@survv/commons/core/utils/datetime';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListVendorUsersResponse } from '@survv/api/definitions/vendors';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { User } from '../../../../../src/core/models/User';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { UserStatus } from '../../../../../src/core/models/UserStatus';
import {
  UsersListAction,
  UsersListMessage,
} from '../../../../../src/core/blocs/users/UsersListMessage';
import { mapVendorUsersListResponseToUsers } from '../../../../../src/shell/repositories/users/mappers/responses';
import { vendorUsersListResponse } from '@survv/api/stubs/vendors';

export function backendUsersListStub(): ListVendorUsersResponse {
  const usersListStubbedResponse = vendorUsersListResponse();
  usersListStubbedResponse.vendorUsers[0].id = 123;
  usersListStubbedResponse.vendorUsers[0].name = 'Ahmed';
  usersListStubbedResponse.vendorUsers[0].email = 'example@example.com';
  usersListStubbedResponse.vendorUsers[0].mobileNo = '01011';
  usersListStubbedResponse.vendorUsers[0].active = true;
  usersListStubbedResponse.vendorUsers[0].creationDate =
    '2021-01-01T10:00:00.000Z';

  usersListStubbedResponse.vendorUsers[1] = {
    ...usersListStubbedResponse.vendorUsers[0],
  };
  usersListStubbedResponse.vendorUsers[1].active = false;

  return usersListStubbedResponse;
}

export function mappedUsersListStub(): ItemsList<User> {
  return mapVendorUsersListResponseToUsers(backendUsersListStub());
}

export function initializeActionMessages(
  localizationService: LocalizationService
): {
  inCaseInitializeSucceeded: () => InitializeActionSucceededMessages;
  inCaseInitializeFailed: () => InitializeActionFailedMessages;
} {
  return {
    inCaseInitializeSucceeded: (): InitializeActionSucceededMessages => {
      const defaultMessage = new UsersListMessage();
      const initializeLoadingMessage =
        (function constructInitializeLoadingMessage(): UsersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new UsersListAction({
            type: 'INITIALIZE',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const initializeUsersListDoneMessage =
        (function constructInitializeDoneMessage(): UsersListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.list = [
            {
              id: 123,
              name: 'Ahmed',
              email: 'example@example.com',
              mobileNo: '01011',
              role: UserRole.CALL_CENTER_AGENT.valueOf(),
              status: localizationService.localize(UserStatus.ACTIVE),
              active: true,
              creationDate: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).toDatetimeString(),
            },
            {
              id: 123,
              name: 'Ahmed',
              email: 'example@example.com',
              mobileNo: '01011',
              role: UserRole.CALL_CENTER_AGENT.valueOf(),
              status: localizationService.localize(UserStatus.INACTIVE),
              active: false,
              creationDate: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).toDatetimeString(),
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeUsersListDoneMessage,
      };
    },
    inCaseInitializeFailed: (): InitializeActionFailedMessages => {
      const defaultMessage = new UsersListMessage();
      const initializeLoadingMessage =
        (function constructSecondMessage(): UsersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new UsersListAction({
            type: 'INITIALIZE',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const initializeUsersListProblematicMessage =
        (function constructThirdMessage(): UsersListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.tableStatus = 'PROBLEMATIC';
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeUsersListProblematicMessage,
      };
    },
  };
}

export function fetchUsersActionMessages(
  localizationService: LocalizationService
): {
  inCaseFetchingUsersSucceeded: () => FetchUsersActionSucceededMessages;
  inCaseFetchingUsersFailed: () => FetchUsersActionFailedMessages;
} {
  return {
    inCaseFetchingUsersSucceeded: (): FetchUsersActionSucceededMessages => {
      const defaultMessage = new UsersListMessage();
      const fetchUsersLoadingMessage =
        (function constructInitializeLoadingMessage(): UsersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new UsersListAction({
            type: 'FETCH_USERS',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const fetchUsersDoneMessage =
        (function constructInitializeDoneMessage(): UsersListMessage {
          const msg = fetchUsersLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.list = [
            {
              id: 123,
              name: 'Ahmed',
              email: 'example@example.com',
              mobileNo: '01011',
              role: UserRole.CALL_CENTER_AGENT.valueOf(),
              status: localizationService.localize(UserStatus.ACTIVE),
              active: true,
              creationDate: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).toDatetimeString(),
            },
            {
              id: 123,
              name: 'Ahmed',
              email: 'example@example.com',
              mobileNo: '01011',
              role: UserRole.CALL_CENTER_AGENT.valueOf(),
              status: localizationService.localize(UserStatus.INACTIVE),
              active: false,
              creationDate: new Datetime(
                '2021-01-01T10:00:00.000Z'
              ).toDatetimeString(),
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        fetchUsersLoadingMessage,
        fetchUsersDoneMessage,
      };
    },
    inCaseFetchingUsersFailed: (): FetchUsersActionFailedMessages => {
      const defaultMessage = new UsersListMessage();
      const fetchUsersLoadingMessage =
        (function constructSecondMessage(): UsersListMessage {
          const msg = defaultMessage.clone();
          msg.action = new UsersListAction({
            type: 'FETCH_USERS',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const fetchUsersProblematicMessage =
        (function constructThirdMessage(): UsersListMessage {
          const msg = fetchUsersLoadingMessage.clone();
          msg.tableStatus = 'PROBLEMATIC';
          return msg;
        })();

      return {
        defaultMessage,
        fetchUsersLoadingMessage,
        fetchUsersProblematicMessage,
      };
    },
  };
}

interface InitializeActionSucceededMessages {
  defaultMessage: UsersListMessage;
  initializeLoadingMessage: UsersListMessage;
  initializeUsersListDoneMessage: UsersListMessage;
}
interface InitializeActionFailedMessages {
  defaultMessage: UsersListMessage;
  initializeLoadingMessage: UsersListMessage;
  initializeUsersListProblematicMessage: UsersListMessage;
}
interface FetchUsersActionSucceededMessages {
  defaultMessage: UsersListMessage;
  fetchUsersLoadingMessage: UsersListMessage;
  fetchUsersDoneMessage: UsersListMessage;
}
interface FetchUsersActionFailedMessages {
  defaultMessage: UsersListMessage;
  fetchUsersLoadingMessage: UsersListMessage;
  fetchUsersProblematicMessage: UsersListMessage;
}
