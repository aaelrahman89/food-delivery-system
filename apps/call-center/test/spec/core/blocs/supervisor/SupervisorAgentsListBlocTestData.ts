import { Datetime } from '@survv/commons/core/utils/datetime';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListVendorUsersResponse } from '@survv/api/definitions/vendors';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import {
  SupervisorAgentsListAction,
  SupervisorAgentsListMessage,
} from '../../../../../src/core/blocs/supervisor/agents/SupervisorAgentsListMessage';
import { User } from '../../../../../src/core/models/User';
import { UserStatus } from '../../../../../src/core/models/UserStatus';
import { mapVendorUsersListResponseToUsers } from '../../../../../src/shell/repositories/users/mappers/responses';
import { vendorUsersListResponse } from '@survv/api/stubs/vendors';

export function backendAgentsListStub(): ListVendorUsersResponse {
  const agentsListStubbedResponse = vendorUsersListResponse();
  agentsListStubbedResponse.vendorUsers[0].id = 123;
  agentsListStubbedResponse.vendorUsers[0].name = 'Ahmed';
  agentsListStubbedResponse.vendorUsers[0].email = 'example@example.com';
  agentsListStubbedResponse.vendorUsers[0].mobileNo = '01011';
  agentsListStubbedResponse.vendorUsers[0].active = true;
  agentsListStubbedResponse.vendorUsers[0].creationDate =
    '2021-01-01T10:00:00.000Z';

  agentsListStubbedResponse.vendorUsers[1] = {
    ...agentsListStubbedResponse.vendorUsers[0],
  };
  agentsListStubbedResponse.vendorUsers[1].active = false;

  return agentsListStubbedResponse;
}

export function mappedAgentsListStub(): ItemsList<User> {
  return mapVendorUsersListResponseToUsers(backendAgentsListStub());
}

export function initializeActionMessages(
  localizationService: LocalizationService
): {
  inCaseInitializeSucceeded: () => InitializeActionSucceededMessages;
  inCaseInitializeFailed: () => InitializeActionFailedMessages;
} {
  return {
    inCaseInitializeSucceeded: (): InitializeActionSucceededMessages => {
      const defaultMessage = new SupervisorAgentsListMessage();
      const initializeLoadingMessage =
        (function constructInitializeLoadingMessage(): SupervisorAgentsListMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorAgentsListAction({
            type: 'INITIALIZE',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const initializeAgentsListDoneMessage =
        (function constructInitializeDoneMessage(): SupervisorAgentsListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.list = [
            {
              id: 123,
              name: 'Ahmed',
              email: 'example@example.com',
              mobileNo: '01011',
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
        initializeAgentsListDoneMessage,
      };
    },
    inCaseInitializeFailed: (): InitializeActionFailedMessages => {
      const defaultMessage = new SupervisorAgentsListMessage();
      const initializeLoadingMessage =
        (function constructSecondMessage(): SupervisorAgentsListMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorAgentsListAction({
            type: 'INITIALIZE',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const initializeAgentsListProblematicMessage =
        (function constructThirdMessage(): SupervisorAgentsListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.tableStatus = 'PROBLEMATIC';
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeAgentsListProblematicMessage,
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
      const defaultMessage = new SupervisorAgentsListMessage();
      const fetchUsersLoadingMessage =
        (function constructInitializeLoadingMessage(): SupervisorAgentsListMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorAgentsListAction({
            type: 'FETCH_USERS',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const fetchUsersDoneMessage =
        (function constructInitializeDoneMessage(): SupervisorAgentsListMessage {
          const msg = fetchUsersLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.list = [
            {
              id: 123,
              name: 'Ahmed',
              email: 'example@example.com',
              mobileNo: '01011',
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
      const defaultMessage = new SupervisorAgentsListMessage();
      const fetchUsersLoadingMessage =
        (function constructSecondMessage(): SupervisorAgentsListMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorAgentsListAction({
            type: 'FETCH_USERS',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const fetchUsersProblematicMessage =
        (function constructThirdMessage(): SupervisorAgentsListMessage {
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
  defaultMessage: SupervisorAgentsListMessage;
  initializeLoadingMessage: SupervisorAgentsListMessage;
  initializeAgentsListDoneMessage: SupervisorAgentsListMessage;
}
interface InitializeActionFailedMessages {
  defaultMessage: SupervisorAgentsListMessage;
  initializeLoadingMessage: SupervisorAgentsListMessage;
  initializeAgentsListProblematicMessage: SupervisorAgentsListMessage;
}
interface FetchUsersActionSucceededMessages {
  defaultMessage: SupervisorAgentsListMessage;
  fetchUsersLoadingMessage: SupervisorAgentsListMessage;
  fetchUsersDoneMessage: SupervisorAgentsListMessage;
}
interface FetchUsersActionFailedMessages {
  defaultMessage: SupervisorAgentsListMessage;
  fetchUsersLoadingMessage: SupervisorAgentsListMessage;
  fetchUsersProblematicMessage: SupervisorAgentsListMessage;
}
