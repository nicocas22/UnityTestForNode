const chai = require("chai");
const assert = chai.assert;
const { it, describe } = require("mocha");
const {
  TimePeriod,
  TimeListType,
  SplitTime,
  TimeLapse,
} = require("../model/schemas");
const { PaymentRepository, PaymentController } = require("./paymentController");
const Configuracion = require("../helper/configuracionHelper");
const configuraciones = Configuracion.getInstancia().configuraciones;

beforeEach(async function () {});

const testCases_computeTimeLapse = [
  // ******* DAILY - BLOCK - IN WEEK ********
  /*** BLOCK **/
  {
    testCase: "daily - block - business day",
    date: new Date(Date.UTC(2020, 4, 28)),
    period: TimePeriod.Daily,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 4, 28)),
      new Date(Date.UTC(2020, 4, 28))
    ),
  },
  {
    testCase: "daily - block - friday",
    date: new Date(Date.UTC(2020, 4, 29)),
    period: TimePeriod.Daily,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 4, 29)),
      new Date(Date.UTC(2020, 4, 29))
    ),
  },
  {
    testCase: "daily - block - saturday",
    date: new Date(Date.UTC(2020, 4, 30)),
    period: TimePeriod.Daily,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 5, 1)),
      new Date(Date.UTC(2020, 5, 1))
    ),
  },
  /*** FUTURE **/
  {
    testCase: "daily - future - business day",
    date: new Date(Date.UTC(2020, 4, 28)),
    period: TimePeriod.Daily,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 4, 29)),
      new Date(Date.UTC(2020, 4, 29))
    ),
  },
  {
    testCase: "daily - future - friday",
    date: new Date(Date.UTC(2020, 4, 29)),
    period: TimePeriod.Daily,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 5, 1)),
      new Date(Date.UTC(2020, 5, 1))
    ),
  },
  {
    testCase: "daily - future - friday",
    date: new Date(Date.UTC(2020, 4, 30)),
    period: TimePeriod.Daily,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 5, 1)),
      new Date(Date.UTC(2020, 5, 1))
    ),
  },

  // ******* WEEKLY - BLOCK ********
  {
    testCase: "weekly - block - monday",
    date: new Date(Date.UTC(2020, 1, 17)),
    period: TimePeriod.Weekly,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 17)),
      new Date(Date.UTC(2020, 1, 21))
    ),
  },
  {
    testCase: "weekly - block - wednesday",
    date: new Date(Date.UTC(2020, 1, 19)),
    period: TimePeriod.Weekly,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 17)),
      new Date(Date.UTC(2020, 1, 21))
    ),
  },
  {
    testCase: "weekly - block - friday - get the same week",
    date: new Date(Date.UTC(2020, 1, 21)),
    period: TimePeriod.Weekly,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 17)),
      new Date(Date.UTC(2020, 1, 21))
    ),
  },
  {
    testCase: "weekly - block - sunday - must be move to next week",
    date: new Date(Date.UTC(2020, 1, 23)),
    period: TimePeriod.Weekly,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 24)),
      new Date(Date.UTC(2020, 1, 28))
    ),
  },

  // ******* WEEKLY - FUTURE ********
  {
    testCase: "weekly - future - monday",
    date: new Date(Date.UTC(2020, 1, 17)),
    period: TimePeriod.Weekly,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 18)),
      new Date(Date.UTC(2020, 1, 24))
    ),
  },
  {
    testCase: "weekly - future - wednesday",
    date: new Date(Date.UTC(2020, 1, 19)),
    period: TimePeriod.Weekly,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 20)),
      new Date(Date.UTC(2020, 1, 26))
    ),
  },
  {
    testCase: "weekly - future - friday - must be move to next week",
    date: new Date(Date.UTC(2020, 1, 21)),
    period: TimePeriod.Weekly,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 24)),
      new Date(Date.UTC(2020, 1, 28))
    ),
  },
  {
    testCase: "weekly - future - sunday - must be move to next week",
    date: new Date(Date.UTC(2020, 1, 23)),
    period: TimePeriod.Weekly,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 24)),
      new Date(Date.UTC(2020, 1, 28))
    ),
  },

  // ******* MONTHLY - BLOCK ********
  {
    testCase: "monthly - block - 1",
    date: new Date(Date.UTC(2020, 1, 1)),
    period: TimePeriod.Monthly,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 1)),
      new Date(Date.UTC(2020, 1, 29))
    ),
  },
  {
    testCase: "monthly - block - 29",
    date: new Date(Date.UTC(2020, 1, 29)),
    period: TimePeriod.Monthly,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 1)),
      new Date(Date.UTC(2020, 1, 29))
    ),
  },
  {
    testCase: "monthly - block - 15",
    date: new Date(Date.UTC(2020, 1, 15)),
    period: TimePeriod.Monthly,
    listType: TimeListType.Block,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 1)),
      new Date(Date.UTC(2020, 1, 29))
    ),
  },

  // ******* MONTHLY - FUTURE ********
  {
    testCase: "monthly - future - 1",
    date: new Date(Date.UTC(2020, 1, 1)),
    period: TimePeriod.Monthly,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 2)),
      new Date(Date.UTC(2020, 2, 2))
    ),
  },
  {
    testCase: "monthly - future - 29",
    date: new Date(Date.UTC(2020, 1, 29)),
    period: TimePeriod.Monthly,
    listType: TimeListType.Future,
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 2, 1)),
      new Date(Date.UTC(2020, 3, 1))
    ),
  },
  {
    testCase: "monthly - future - 15",
    date: new Date(Date.UTC(2020, 1, 15)),
    period: TimePeriod.Monthly,
    listType: TimeListType.Future,
    /** @type {TimeLapse} **/
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 16)),
      new Date(Date.UTC(2020, 2, 16))
    ),
  },
];

describe("#computeTimeLapse()", function () {
  testCases_computeTimeLapse.forEach(function (testCase) {
    it(`${
      testCase.testCase
    } - ${testCase.date.getUTCDate()}`, async function () {
      /** @type {TimeLapse} **/
      const result = await PaymentController.computeTimeLapse(
        testCase.date,
        testCase.period,
        testCase.listType
      );
      const startGot = result.startTime.toUTCString();
      const endGot = result.endTime.toUTCString();
      const startExpected = testCase.expected.startTime.toUTCString();
      const endExpected = testCase.expected.endTime.toUTCString();
      assert(
        result.startTime.toUTCString() ===
          testCase.expected.startTime.toUTCString(),
        `${startGot} != ${startExpected}`
      );
      assert(
        result.endTime.toUTCString() ===
          testCase.expected.endTime.toUTCString(),
        `${endGot} != ${endExpected}`
      );
      console.log(result);
    });
  });
});

const testCases_getProcessedPaymentsTimeLapse = [
  {
    testCase: "only past",
    splitTime: new SplitTime(
      [new Date(Date.UTC(2020, 1, 1)), new Date(Date.UTC(2020, 1, 5))],
      [],
      []
    ),
    expectedSize: 6,
  },
  {
    testCase: "past and present",
    splitTime: new SplitTime(
      [new Date(Date.UTC(2020, 1, 1)), new Date(Date.UTC(2020, 1, 5))],
      [new Date(Date.UTC(2020, 1, 6)), new Date(Date.UTC(2020, 1, 6))],
      []
    ),
    expectedSize: 6,
  },
];

describe("#getProcessedPaymentsTimeLapse()", function () {
  testCases_getProcessedPaymentsTimeLapse.forEach(function (testCase) {
    it(testCase.testCase, async function () {
      const result = await PaymentController.getProcessedPaymentsTimeLapse(
        testCase.splitTime
      );
    });
  });
});

const testCases_getProcessedPayments = [
  {
    testCase: "SUCCESS",
    rut: "26349413K",
    xCase: "OK",
    startDate: new Date(Date.UTC(2020, 1, 6)),
    endDate: new Date(Date.UTC(2020, 1, 10)),
    expected: new TimeLapse(
      new Date(Date.UTC(2020, 1, 1)),
      new Date(Date.UTC(2020, 1, 5))
    ),
  },
];

describe("#getProcessedPayments()", function () {
  testCases_getProcessedPayments.forEach(function (testCase) {
    it(testCase.testCase, async function () {
      configuraciones.xCase = testCase.xCase;
      const result = await PaymentRepository.getProcessedPayments(
        testCase.rut,
        new TimeLapse(testCase.startDate, testCase.endDate)
      );
      console.log(result);
    });
  });
});

describe("#getProcessedPaymentsSummary()", function () {
  testCases_getProcessedPayments.forEach(function (testCase) {
    it(testCase.testCase, async function () {
      configuraciones.xCase = testCase.xCase;
      const result = await PaymentRepository.getProcessedPaymentsSummary(
        testCase.rut,
        new TimeLapse(testCase.startDate, testCase.endDate)
      );
      console.log(result);
    });
  });
});

describe("#getFuturePaymentsSummary()", function () {
  testCases_getProcessedPayments.forEach(function (testCase) {
    it(testCase.testCase, async function () {
      configuraciones.xCase = testCase.xCase;
      const result = await PaymentRepository.getFuturePaymentsSummary(
        testCase.rut,
        new TimeLapse(testCase.startDate, testCase.endDate)
      );
      console.log(result);
    });
  });
});

const testCases_getPayments = [
  {
    testCase: "SUCCESS",
    rut: "26349413K",
    xCase: "MAYO_2020_WEEK_BLOCK_18_22",
    startDate: new Date(Date.UTC(2020, 4, 18)),
    endDate: new Date(Date.UTC(2020, 4, 22)),
    timeNow: new Date(Date.UTC(2020, 4, 20)),
    fillMissingDates: true,
  },
];

describe("#getPayments()", function () {
  testCases_getPayments.forEach(function (testCase) {
    it(testCase.testCase, async function () {
      configuraciones.xCase = testCase.xCase;
      const result = await PaymentController.getPayments(
        testCase.rut,
        testCase.startDate,
        testCase.endDate,
        testCase.fillMissingDates,
        testCase.timeNow
      );
      console.log(result);
    });
  });
});
