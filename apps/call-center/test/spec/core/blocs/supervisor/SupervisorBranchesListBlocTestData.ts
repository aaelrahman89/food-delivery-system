import { Branch } from '../../../../../src/core/models/Branch';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { ConsumerB2CBranchesListResponse } from '@survv/api/definitions/branches';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import {
  SupervisorBranchesListAction,
  SupervisorBranchesListMessage,
} from '../../../../../src/core/blocs/supervisor/branches/SupervisorBranchesListMessage';
import { consumerB2cBranchesListResponseStub } from '@survv/api/stubs/branches';
import { mapBranchesListV2ResponseToBranches } from '../../../../../src/shell/repositories/branches/mappers/responses';

export function backendBranchesListStub(): ConsumerB2CBranchesListResponse {
  const branchesListStubbedResponse = consumerB2cBranchesListResponseStub();
  branchesListStubbedResponse.branches[0].id = 123;
  branchesListStubbedResponse.branches[0].label = 'KFC';
  branchesListStubbedResponse.branches[0].b2cStatus = 'AVAILABLE';

  return branchesListStubbedResponse;
}

export function mappedBranchesListStub(): Branch[] {
  return mapBranchesListV2ResponseToBranches(backendBranchesListStub());
}

export function initializeActionMessages(
  localizationService: LocalizationService
): {
  inCaseInitializeSucceeded: () => InitializeActionSucceededMessages;
  inCaseInitializeFailed: () => InitializeActionFailedMessages;
} {
  return {
    inCaseInitializeSucceeded: (): InitializeActionSucceededMessages => {
      const defaultMessage = new SupervisorBranchesListMessage();
      const initializeLoadingMessage =
        (function constructInitializeLoadingMessage(): SupervisorBranchesListMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorBranchesListAction({
            type: 'INITIALIZE',
          });
          msg.tableStatus = 'LOADING';
          msg.state.filtersData.statusList = BranchB2CStatus.lookup().map(
            (status) => ({
              label: localizationService.localize(status.toString()),
              value: status.valueOf(),
            })
          );
          return msg;
        })();
      const initializeBranchesListDoneMessage =
        (function constructInitializeDoneMessage(): SupervisorBranchesListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.tableStatus = 'IDLE';
          msg.state.list = [
            {
              id: 123,
              label: 'KFC',
              status: localizationService.localize(BranchB2CStatus.AVAILABLE),
            },
          ];
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeBranchesListDoneMessage,
      };
    },
    inCaseInitializeFailed: (): InitializeActionFailedMessages => {
      const defaultMessage = new SupervisorBranchesListMessage();
      const initializeLoadingMessage =
        (function constructSecondMessage(): SupervisorBranchesListMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorBranchesListAction({
            type: 'INITIALIZE',
          });
          msg.tableStatus = 'LOADING';
          msg.state.filtersData.statusList = BranchB2CStatus.lookup().map(
            (status) => ({
              label: localizationService.localize(status.toString()),
              value: status.valueOf(),
            })
          );
          return msg;
        })();
      const initializeBranchesListProblematicMessage =
        (function constructThirdMessage(): SupervisorBranchesListMessage {
          const msg = initializeLoadingMessage.clone();
          msg.tableStatus = 'PROBLEMATIC';
          return msg;
        })();

      return {
        defaultMessage,
        initializeLoadingMessage,
        initializeBranchesListProblematicMessage,
      };
    },
  };
}

export function fetchBranchesActionMessages(
  localizationService: LocalizationService
): {
  inCaseFetchingBranchesSucceeded: () => FetchBranchesActionSucceededMessages;
  inCaseFetchingBranchesFailed: () => FetchBranchesActionFailedMessages;
} {
  return {
    inCaseFetchingBranchesSucceeded:
      (): FetchBranchesActionSucceededMessages => {
        const defaultMessage = new SupervisorBranchesListMessage();
        const fetchBranchesLoadingMessage =
          (function constructInitializeLoadingMessage(): SupervisorBranchesListMessage {
            const msg = defaultMessage.clone();
            msg.action = new SupervisorBranchesListAction({
              type: 'FETCH_BRANCHES',
            });
            msg.tableStatus = 'LOADING';
            return msg;
          })();
        const fetchBranchesDoneMessage =
          (function constructInitializeDoneMessage(): SupervisorBranchesListMessage {
            const msg = fetchBranchesLoadingMessage.clone();
            msg.tableStatus = 'IDLE';
            msg.state.list = [
              {
                id: 123,
                label: 'KFC',
                status: localizationService.localize(BranchB2CStatus.AVAILABLE),
              },
            ];
            return msg;
          })();

        return {
          defaultMessage,
          fetchBranchesLoadingMessage,
          fetchBranchesDoneMessage,
        };
      },
    inCaseFetchingBranchesFailed: (): FetchBranchesActionFailedMessages => {
      const defaultMessage = new SupervisorBranchesListMessage();
      const fetchBranchesLoadingMessage =
        (function constructSecondMessage(): SupervisorBranchesListMessage {
          const msg = defaultMessage.clone();
          msg.action = new SupervisorBranchesListAction({
            type: 'FETCH_BRANCHES',
          });
          msg.tableStatus = 'LOADING';
          return msg;
        })();
      const fetchBranchesProblematicMessage =
        (function constructThirdMessage(): SupervisorBranchesListMessage {
          const msg = fetchBranchesLoadingMessage.clone();
          msg.tableStatus = 'PROBLEMATIC';
          return msg;
        })();

      return {
        defaultMessage,
        fetchBranchesLoadingMessage,
        fetchBranchesProblematicMessage,
      };
    },
  };
}

interface InitializeActionSucceededMessages {
  defaultMessage: SupervisorBranchesListMessage;
  initializeLoadingMessage: SupervisorBranchesListMessage;
  initializeBranchesListDoneMessage: SupervisorBranchesListMessage;
}
interface InitializeActionFailedMessages {
  defaultMessage: SupervisorBranchesListMessage;
  initializeLoadingMessage: SupervisorBranchesListMessage;
  initializeBranchesListProblematicMessage: SupervisorBranchesListMessage;
}
interface FetchBranchesActionSucceededMessages {
  defaultMessage: SupervisorBranchesListMessage;
  fetchBranchesLoadingMessage: SupervisorBranchesListMessage;
  fetchBranchesDoneMessage: SupervisorBranchesListMessage;
}
interface FetchBranchesActionFailedMessages {
  defaultMessage: SupervisorBranchesListMessage;
  fetchBranchesLoadingMessage: SupervisorBranchesListMessage;
  fetchBranchesProblematicMessage: SupervisorBranchesListMessage;
}
