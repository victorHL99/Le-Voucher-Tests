import { jest } from "@jest/globals";
import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";
import * as errorUtils from "utils/errorUtils";

describe("CreateVoucher unit tests suite ", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return success case for creation of voucher", async () => {

    const code = "TEST123";
    const discount = 10;
    const voucher = {
      id: 1,
      code,
      discount,
      used: false
    };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);
    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => {
      return voucher;
    });

    await voucherService.createVoucher(code, discount);

    expect(voucherRepository.createVoucher).toBeCalledWith(code, discount);

  });

  it("should return ''Voucher already exist.' error for creation of voucher", async () => {

    const code = "TEST123";
    const discount = 10;
    const voucher = {
      id: 1,
      code,
      discount,
      used: false
    };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);
    const mockConflictError = jest.spyOn(errorUtils, "conflictError").mockImplementationOnce((): any => {
      return new Error("Voucher already exist.");
    });

    await expect(voucherService.createVoucher(code, discount)).rejects.toThrowError("Voucher already exist.");
    expect(mockConflictError).toHaveBeenCalledWith('Voucher already exist.');
    expect(voucherRepository.getVoucherByCode).toHaveBeenCalledWith(code);
    expect(voucherRepository.createVoucher).not.toHaveBeenCalled();
  });
});

describe("ApplyVoucher unit tests suite ", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return {amount, discount, finalAmount, applied} for apply voucher", async () => {
    const code = "TEST123";
    const amount = 100;
    const voucher = {
      id: 1,
      code,
      discount: 10,
      used: false
    };
    const response = {
      amount,
      discount: voucher.discount,
      finalAmount: amount - (amount * (voucher.discount / 100)),
      applied: true
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);
    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce({} as any);
    jest.mock("services/voucherService", () => {
      return {
        isAmountValidForDiscount: () => true,
        changeVoucherToUsed: () => voucher.used = true,
        applyDiscount: () => response.finalAmount = amount - (amount * (voucher.discount / 100))
      }
    })

    const result = await voucherService.applyVoucher(code, amount);

    expect(result).toEqual(response);

  });
});