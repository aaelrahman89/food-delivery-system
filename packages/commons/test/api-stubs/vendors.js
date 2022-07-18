import { wiremock } from '../utils/wiremock';

export async function stubVendorReceiptUpload({
  vendorId,
  receiptImage,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/vendors/:vendorId/receipts',
      params: {
        vendorId,
      },
      body: {
        referenceType: 'vendorReceiptImage',
        receiptImage,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 98714,
        ...resBody,
      },
    });
}

export async function stubVendorBalance({
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/vendors/:vendorId/balance',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        balance: {
          amount: 7650.32,
          currency: 'EGP',
        },
        overdraftLimit: {
          amount: {
            amount: 31.01,
            currency: 'EGP',
          },
          dueDate: '2018-09-05T19:04:53.178Z',
        },
        ...resBody,
      },
    });
}

export async function stubVendorProfile({
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1.2/vendors/:vendorId',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: vendorId,
        ledgerId: 2165529378315486700,
        paymentRiskStatus: '_02_NORMAL',
        legalInfo: {
          companyAddress: 'company address',
          companyName: 'company name',
        },
        branchCount: 50,
        activeBranchesCount: 50,
        transactionCount: 20,
        averagePrepTime: 10,
        label: 'McDonald',
        type: 'FOOD',
        prepaid: false,
        trackingSMS: false,
        subscriptionStatus: '_01_AT_RISK',
        creationDate: '2018-09-05T19:04:53.178Z',
        active: false,
        displayName: {
          en: 'en',
          ar: 'ar',
        },
        languageSupport: {
          en: true,
          ar: true,
        },
        hasProfile: false,
        taxStatus: 'NOT_APPLICABLE',
        vendorUsers: [
          {
            vendorUserId: 123654789,
            fullName: 'Bakaka Dassa',
            mobileNo: '75453736531',
            email: 'example@domain.com',
            title: 'Dassa',
            creationDate: '2018-09-05T19:04:53.178Z',
            status: 'Registered',
          },
        ],
        tags: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            type: 'NONE',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        hashTags: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            status: 'VISIBLE',
            vendorType: 'FOOD',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        tax: 10,
        minimumOrderValue: {
          amount: 10,
          currency: 'EGP',
        },
        orderingHours: {
          from: '19:04:53',
          to: '20:04:53',
        },
        dispatchPriority: 'NORMAL',
        rating: 5.0,
        stacking: false,
        maxStackedOrders: 0,
        stackingWindowInMinutes: 1,
        ...resBody,
      },
    });
}

export async function stubGetVendorOnlineProfile({
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/vendors/:vendorId/profile',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 2165529378315486700,
        label: 'Mac',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        description: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        languageSupport: {
          en: true,
          ar: true,
        },
        tax: 14,
        minimumOrderValue: {
          amount: 31.01,
          currency: 'EGP',
        },
        orderingHours: {
          from: '19:04:53',
          to: '19:04:53',
        },
        hasProfile: true,
        hashTags: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        tags: [
          {
            id: 2165529378315486700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            type: 'CUISINE',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
        ...resBody,
      },
    });
}

export async function stubVendorBranchConsumptionReport({
  vendorId,
  month,
  year,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/vendors/:vendorId/branches-consumption',
      params: { vendorId },
      query: { month, year },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        subTotal: {
          amount: 31.01,
          currency: 'EGP',
        },
        tax: {
          amount: 31.01,
          currency: 'EGP',
        },
        total: {
          amount: 31.01,
          currency: 'EGP',
        },
        zoneRatesLimit: 2,
        branchesConsumptions: [
          {
            branchId: 2165529378315486700,
            branchLabel: 'KFC- Maadi',
            deliveredTasksCount: 150,
            returnedTasksCount: 150,
            totalBaseValue: {
              amount: 31.01,
              currency: 'EGP',
            },
            deductions: {
              pilotDelay: {
                firstTier: 150,
                secondTier: 150,
              },
              totalValue: {
                amount: 31.01,
                currency: 'EGP',
              },
            },
            penalties: {
              branchDelay: {
                firstTier: 150,
                secondTier: 150,
                thirdTier: 150,
              },
              lateCancellation: 150,
              totalValue: {
                amount: 31.01,
                currency: 'EGP',
              },
            },
            tasksPerZoneRate: {
              zoneRates: {
                rate1: 60,
                rate2: 60,
                rate3: 60,
                rate4: 60,
                outOfZone: 60,
              },
            },
            refunds: {
              amount: 31.01,
              currency: 'EGP',
            },
            compensation: {
              amount: 31.01,
              currency: 'EGP',
            },
            extraServices: {
              tablet: {
                amount: 31.01,
                currency: 'EGP',
              },
              data: {
                amount: 31.01,
                currency: 'EGP',
              },
            },
            totalTransactionsValue: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
        ],
        ...resBody,
      },
    });
}

export async function stubVendorTasksList({
  query,
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      query,
      requestLine: 'get /api/v1/vendors/:vendorId/tasks',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        metadata: {
          skipped: 0,
          limit: 25,
          totalCount: 1,
          totalReturned: 1,
        },
        tasks: [
          {
            id: 2165529378315486700,
            tripId: 2165529378315486700,
            pilotId: 2165529378315486700,
            pilotName: 'Name',
            pilot: {
              id: 2165529378315486700,
              mobileNo: '0102312381',
              fullName: 'Bakaka Dassa',
            },
            status: 'REACHED',
            dailyClosingStatus: 'CLOSED',
            creationDate: '2018-09-01T18:04:53.178Z',
            lastStatusUpdateDate: '2018-09-05T19:04:53.178Z',
            lastUpdateDate: '2018-09-05T19:04:53.178Z',
            vendorTaskId: '2165529378315486654',
            vendorBranchId: 2165529378315486700,
            vendorId: 2165529378315486700,
            vendorBranchLabel: 'label',
            customerMobileNo: '01069262360',
            durationInSeconds: 90,
            distanceInMeters: 3350,
            estimatedDistanceInMeters: 3350,
            value: 12.5,
            hasComplaint: false,
            pinnedDestinationPoint: {
              type: 'Point',
              coordinates: [-1.43, 31.3],
            },
            geoPoints: [
              {
                type: 'Point',
                coordinates: [-1.43, 31.3],
              },
            ],
            paymentMethod: 'Cash',
            cancellationReason: 'AnyReason',
            notes: 'Cancel Note',
            cancellationCategory: 'QUICK_CANCELLATION',
            disputeDetails: {
              status: '_02_APPROVED',
              category: 'ZONE',
              description: 'I want tmy money back',
              disputeDate: '2018-09-05T19:04:53.178Z',
              reviewerDescription: 'No money for you',
              reviewerId: 123654789,
              reviewerEmail: 'example@domain.com',
              reviewDate: '2018-09-05T19:04:53.178Z',
            },
            survvCancellationReason: 'Survv Cancellation',
            customer: {
              id: 2165529378315486700,
              addressId: 2165529378315486700,
              mobileNo: '01061239214',
            },
            linkStatus: 'UNDECIDED',
          },
        ],
        ...resBody,
      },
    });
}

export async function stubVendorReceiptsList({
  query,
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      query,
      requestLine: 'get /api/v1/vendors/:vendorId/receipts',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 1,
          totalReturned: 1,
        },
        receipts: [
          {
            id: 654365437,
            vendorUserId: 563546532,
            vendorId: 867865776,
            reviewer: {
              userId: 123654789,
              email: 'reviewer@survv.com',
            },
            rejectionReason: 'NoReason',
            status: 'PENDING',
            amount: {
              amount: 17.01,
              currency: 'EGP',
            },
            creationDate: '2013-09-05T13:04:13.178Z',
            lastUpdateDate: '2013-09-05T13:04:13.178Z',
          },
        ],
        ...resBody,
      },
    });
}

export async function stubVendorInvoicesList({
  query,
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      query,
      requestLine: 'get /api/v1/vendors/:vendorId/invoices',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 2,
          totalReturned: 0,
        },
        invoices: [
          {
            vendorId,
            id: 2167529378315486700,
            vendorLabel: 'KFC',
            serial: 'AB123456789',
            billCycleFrom: '2018-09-05T19:04:53.178Z',
            billCycleTo: '2018-09-05T19:04:53.178Z',
            creationDate: '2018-09-05T19:04:53.178Z',
            issuedOnDate: '2018-09-05T19:04:53.178Z',
            status: 'PENDING_REVIEW',
            total: {
              amount: 31.01,
              currency: 'EGP',
            },
            promotionRate: 14,
          },
        ],
        ...resBody,
      },
    });
}

export async function stubVendorSingleInvoice({
  vendorId,
  invoiceId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/vendors/:vendorId/invoices/:invoiceId',
      params: { vendorId, invoiceId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: invoiceId,
        total: {
          amount: 31.01,
          currency: 'EGP',
        },
        subTotal: {
          amount: 31.01,
          currency: 'EGP',
        },
        tax: {
          amount: 31.01,
          currency: 'EGP',
        },
        totalBranchesCharges: {
          amount: 31.01,
          currency: 'EGP',
        },
        invoiceInfo: {
          vendorId,
          vendorLabel: 'KFC',
          legalInfo: {
            companyName: 'Company Name',
            companyAddress: 'Maadi',
          },
          bankInfo: {
            name: 'Bank Name',
            account: 'ABDC',
          },
          status: 'PENDING_REVIEW',
          version: 0,
          serial: 'AB123456789',
          currency: 'EGP | E£',
          issuedOnDate: '2018-09-05T20:04:53.178Z',
          creationDate: '2018-09-05T19:04:53.178Z',
          dueDate: '2018-09-05T19:04:53.178Z',
          billCycleFrom: '2018-09-05T19:04:53.178Z',
          billCycleTo: '2018-09-05T19:04:53.178Z',
          businessBillCycleFrom: '2018-09-05',
          businessBillCycleTo: '2018-09-05',
          promotionRate: 14,
          pdfGenerated: true,
          pdfGenerationDate: '2018-09-05T19:04:53.178Z',
        },
        vendorCharges: {
          delivered: {
            numberOfUnits: 33,
            total: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          returned: {
            numberOfUnits: 33,
            total: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          penaltyCancellation: {
            numberOfUnits: 33,
            total: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          branchDelay: {
            numberOfUnits: 33,
            total: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          pilotDelay: {
            numberOfUnits: 33,
            total: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          compensation: {
            numberOfUnits: 33,
            total: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
          others: {
            numberOfUnits: 33,
            total: {
              amount: 31.01,
              currency: 'EGP',
            },
          },
        },
        branchesCharges: [
          {
            branchId: 234567890,
            branchName: 'Bakaka Dessa',
            delivered: 88,
            returned: 1827,
            penaltyCancellation: 1284,
            branchDelayTier1: 1234,
            branchDelayTier2: 6991,
            branchDelayTier3: 6991,
            pilotDelayTier1: 9822,
            pilotDelayTier2: 9822,
          },
        ],
        averagePrices: {
          delivered: {
            amount: 31.01,
            currency: 'EGP',
          },
          returned: {
            amount: 31.01,
            currency: 'EGP',
          },
          penaltyCancellation: {
            amount: 31.01,
            currency: 'EGP',
          },
          branchDelayTier1: {
            amount: 31.01,
            currency: 'EGP',
          },
          branchDelayTier2: {
            amount: 31.01,
            currency: 'EGP',
          },
          branchDelayTier3: {
            amount: 31.01,
            currency: 'EGP',
          },
          pilotDelayTier1: {
            amount: 31.01,
            currency: 'EGP',
          },
          pilotDelayTier2: {
            amount: 31.01,
            currency: 'EGP',
          },
          branchDelay: {
            amount: 31.01,
            currency: 'EGP',
          },
          pilotDelay: {
            amount: 31.01,
            currency: 'EGP',
          },
          compensation: {
            amount: 31.01,
            currency: 'EGP',
          },
          others: {
            amount: 31.01,
            currency: 'EGP',
          },
        },
        ...resBody,
      },
    });
}

export async function stubVendorInvoiceDownloadLink({
  vendorId,
  invoiceId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine:
        'get /api/v1/vendors/:vendorId/invoices/:invoiceId/download-link',
      params: { vendorId, invoiceId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        url: 'https://srvbeta.exampleLink.com/api/v1/invoices/1234/download?token=123987896ykjdhfa',
        ...resBody,
      },
    });
}

export async function stubGetMinimumCommitment({
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/vendors/:vendorId/min-commitment',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        minCommitmentType: 'MIN_TRANSACTIONS',
        minCommitmentValue: 200,
        ...resBody,
      },
    });
}

export async function stubSetMinimumCommitment({
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/vendors/:vendorId/min-commitment',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        minCommitmentType: 'MIN_TRANSACTIONS',
        ...resBody,
      },
    });
}

export async function stubTiersList({
  vendorId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/vendors/:vendorId/tiers',
      params: { vendorId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        currentMultipleFees: true,
        futureMultipleFees: true,
        currentTiers: [
          {
            name: 'Tier 1',
            singleTransactionFees: { amount: 10, currency: 'EGP' },
            multipleTransactionsFees: { amount: 10, currency: 'EGP' },
            active: true,
            remainingTransactions: 10,
            transactionsRange: {
              min: 1,
              max: 150,
            },
          },
        ],
        futureTiers: [
          {
            name: 'Tier 2',
            singleTransactionFees: { amount: 10, currency: 'EGP' },
            multipleTransactionsFees: { amount: 10, currency: 'EGP' },
            transactionsRange: {
              min: 1,
              max: 150,
            },
          },
        ],
        ...resBody,
      },
    });
}

export async function stubVendorOnlineProfileCreation({
  vendorId,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/vendors/:vendorId/profile',
      params: { vendorId },
    })
    .response({ status: statusCode });
}
